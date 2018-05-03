using System;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Security.Cryptography;
using Luxena;
using Onko.Core.Data;
using Onko.Core;
using Onko.Core.Contracts;

namespace Onko.Core.Impl
{
    public class Session
    {
        //static Session()
        //{
        //    _encryptionKey = Convert.FromBase64String(Settings.Instance.Encryption.Key);

        //    _aesPool = new Pool<Aes>(() =>
        //    {
        //        var aes = Aes.Create();

        //        if (aes == null)
        //            throw new CryptographicException("Cannot create AES algorithm");

        //        aes.Padding = PaddingMode.None;

        //        return aes;
        //    });

        //    var bytes = BitConverter.GetBytes(0L) // expiration
        //        .Concat(BitConverter.GetBytes(0L)) // identifier
        //        .ToArray();

        //    _tokenDataLength = bytes.Length;

        //    (_tokenIvLength, _tokenLength) = RunAes(aes =>
        //    {
        //        using (var encryptor = aes.CreateEncryptor(_encryptionKey, aes.IV))
        //            return (
        //                aes.IV.Length,
        //                encryptor.TransformFinalBlock(bytes, 0, bytes.Length).Length
        //            );
        //    });

        //    _tokenLength += _tokenIvLength;
        //}

        public Session()
        {
            _settings = Settings.Instance.Encryption;
            _key = Convert.FromBase64String(_settings.Key);
        }

        static Session()
        {
            _aesPool = new Pool<Aes>(() =>
            {
                var obj = Aes.Create();

                if (obj == null)
                    throw new CryptographicException("Cannot create AES algorithm");

                return obj;
            });

            var blockSize = RunAes(aes => aes.BlockSize) / 8;

            _tokenIvLength = blockSize;

            _tokenDataLength = sizeof(long) + sizeof(long) + Contracts.Doctor.PasswordSize;

            _tokenLength = blockSize * (_tokenDataLength / blockSize);

            if (_tokenLength < _tokenDataLength)
                _tokenLength += blockSize;

            _tokenLength += _tokenIvLength;
        }


        public string Identity { get; private set; }

        public Doctor Doctor { get; private set; }

        public bool LogIn(string login, string password)
        {
            using (var work = BeginWork())
            {
                var db = work.Database;

                var user = db.Doctors.SingleOrDefault(u => u.Login.Equals(login));

                if (user == null || !user.ValidatePassword(password))
                    return false;

                SetIdentity(user);

                return true;
            }
        }
        public bool LogIn(byte[] accessToken)
        {
            if (accessToken == null || accessToken.Length != _tokenLength)
                return false;

            var bytes = RunAes(aes =>
            {
                var iv = accessToken.Take(_tokenIvLength).ToArray();

                using (var decryptor = aes.CreateDecryptor(_key, iv))
                    return decryptor.TransformFinalBlock(accessToken, iv.Length, accessToken.Length - iv.Length);
            });

            if (bytes.Length != _tokenDataLength)
                return false;

            var offset = 0;

            var expiresAt = BitConverter.ToInt64(bytes, offset);

            if (DateTime.Now.Ticks > expiresAt)
                return false;

            offset += sizeof(long);

            var id = BitConverter.ToInt64(bytes, offset);

            offset += sizeof(long);

            var pass = bytes.Skip(offset).ToArray();

            using (var work = BeginWork())
            {
                var db = work.Database;
                var doctor = db.Doctors.SingleOrDefault(x=>x.Id == id && x.Password == pass);

                if (doctor == null)
                    return false;

                SetIdentity(doctor);

                return true;
            }
        }

        public byte[] GetAccessToken(long expiresIn)
        {
            if (Doctor == null)
                return null;

            var bytes = BitConverter.GetBytes(DateTime.UtcNow.AddSeconds(expiresIn).Ticks)
                .Concat(BitConverter.GetBytes(Doctor.Id))
                .Concat(Doctor.Password)
                .ToArray();

            var token = RunAes(aes =>
            {
                using (var encryptor = aes.CreateEncryptor(_key, aes.IV))
                    return aes.IV.Concat(encryptor.TransformFinalBlock(bytes, 0, bytes.Length)).ToArray();
            });

            return token;
        }

        internal UnitOfWork BeginWork(bool transactional = true)
        {
            if (_unitOfWork != null)
                return new UnitOfWork(_unitOfWork, transactional);

            _unitOfWork = new UnitOfWork(transactional, () => _unitOfWork = null);

            return _unitOfWork;
        }

        private static T RunAes<T>(Func<Aes, T> func)
        {
            return _aesPool.Run(func);
        }

        internal void SetIdentity(Doctor cardQuest)
        {
            Identity = cardQuest.Id.ToString();

            Doctor = cardQuest;
        }

        private readonly byte[] _key;

        private readonly EncryptSettings _settings;

        private static readonly byte[] _encryptionKey;

        private static readonly Pool<Aes> _aesPool;

        private static readonly int _tokenLength;

        private static readonly int _tokenIvLength;

        private static readonly int _tokenDataLength;

        private UnitOfWork _unitOfWork;
    }
}
