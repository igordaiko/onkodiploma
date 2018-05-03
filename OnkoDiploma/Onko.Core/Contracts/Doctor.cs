
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using LinqToDB.Mapping;

namespace Onko.Core.Contracts
{
    [Table]
    public class Doctor
    {
        public static readonly int PasswordSize = CalcPasswordSize();

        [Column("id"), PrimaryKey, Identity]
        public long Id { get; set; }

        [Column]
        public string Login { get; set; }

        [Column]
        public string Name { get; set; }

        [Column]
        public byte[] Password { get; set; }

        [Column]
        public int Roles { get; set; }

        [Column]
        public byte[] Salt { get; set; }

        public bool ValidatePassword(string password)
        {
            return GetPasswordFromString(password).SequenceEqual(Password);
        }

        public void SetPassword(string password)
        {
            Salt = CreateSalt();

            Password = GetPasswordFromString(password);
        }

        private static int CalcPasswordSize()
        {
            using (var hash = SHA1.Create())
                return hash.HashSize / 8;
        }

        public byte[] GetPasswordFromString(string password)
        {
            using (var hash = SHA1.Create())
                return hash.ComputeHash(Encoding.Unicode.GetBytes(password).Concat(Salt).ToArray());
        }

        private static byte[] CreateSalt()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                var buff = new byte[SaltSize];
                rng.GetBytes(buff);
                return buff;
            }
        }

        private const int SaltSize = 16;

    }

    internal enum Role
    {
        Administrator = 1,
        Moderator = 2,
        Supervisor = 4,
        Doctor = 8
    }
}
