using System;
using System.Linq;
using System.Security.Cryptography;
using Luxena;
using OnkoDiploma.Core.Data;

namespace OnkoDiploma.Core.Impl
{
    public class Session
    {
        static Session()
        {
            _encryptionKey = Convert.FromBase64String(Settings.Instance.Encryption.Key);

            _aesPool = new Pool<Aes>(() =>
            {
                var aes = Aes.Create();

                if (aes == null)
                    throw new CryptographicException("Cannot create AES algorithm");

                aes.Padding = PaddingMode.None;

                return aes;
            });

            var bytes = BitConverter.GetBytes(0L) // expiration
                .Concat(BitConverter.GetBytes(0L)) // identifier
                .ToArray();

            _tokenDataLength = bytes.Length;

            (_tokenIvLength, _tokenLength) = RunAes(aes =>
            {
                using (var encryptor = aes.CreateEncryptor(_encryptionKey, aes.IV))
                    return (
                        aes.IV.Length,
                        encryptor.TransformFinalBlock(bytes, 0, bytes.Length).Length
                    );
            });

            _tokenLength += _tokenIvLength;
        }

        public string Identity { get; private set; }

        //public CardQuest CardQuest { get; private set; }

        //public (CardQuest CardQuest, bool SystemFailure) LogIn(long cardNumber, DateTime dateOfBirth)
        //{
        //    var response = CardQuests.Get(cardNumber, dateOfBirth);

        //    if (response.CardQuest != null)
        //        SetIdentity(response.CardQuest);

        //    return response;
        //}

        //public bool LogIn(byte[] accessToken)
        //{
        //    if (accessToken == null || accessToken.Length != _tokenLength)
        //        return false;

        //    var bytes = RunAes(aes =>
        //    {
        //        var iv = accessToken.Take(_tokenIvLength).ToArray();

        //        using (var decryptor = aes.CreateDecryptor(_encryptionKey, iv))
        //            return decryptor.TransformFinalBlock(accessToken, iv.Length, accessToken.Length - iv.Length);
        //    });

        //    if (bytes.Length != _tokenDataLength)
        //        return false;

        //    var offset = 0;

        //    var expiresAt = BitConverter.ToInt64(bytes, offset);

        //    if (DateTime.Now.Ticks > expiresAt)
        //        return false;

        //    offset += sizeof(long);
        //    var cardId = BitConverter.ToInt64(bytes, offset);

        //    var cardQuest = CardQuests.Get(cardId);

        //    if (cardQuest == null)
        //        return false;

        //    SetIdentity(cardQuest);

        //    return true;
        //}

        //public byte[] GetAccessToken(long expiresIn)
        //{
        //    if (CardQuest == null)
        //        return null;

        //    var bytes = BitConverter.GetBytes(expiresIn)
        //        .Concat(BitConverter.GetBytes(CardQuest.CardId))
        //        .ToArray();

        //    var token = RunAes(aes =>
        //    {
        //        using (var encryptor = aes.CreateEncryptor(_encryptionKey, aes.IV))
        //            return aes.IV.Concat(encryptor.TransformFinalBlock(bytes, 0, bytes.Length)).ToArray();
        //    });

        //    return token;
        //}

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

        //internal void SetIdentity(CardQuest cardQuest)
        //{
        //    Identity = cardQuest.CardId.ToString();

        //    CardQuest = cardQuest;
        //}

        private readonly byte[] _key;
        private static readonly byte[] _encryptionKey;

        private static readonly Pool<Aes> _aesPool;

        private static readonly int _tokenLength;

        private static readonly int _tokenIvLength;

        private static readonly int _tokenDataLength;

        private UnitOfWork _unitOfWork;
    }
}
