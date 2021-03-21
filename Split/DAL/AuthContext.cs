using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Split.DAL.Models;

namespace Split.DAL
{
    public class AuthContext : KeyApiAuthorizationDbContext<MultiAccount, AppRole, long>
    {
        /// <summary>
        /// Initializes a new instance of <see cref="ApiAuthorizationDbContext{TUser}"/>.
        /// </summary>
        /// <param name="options">The <see cref="DbContextOptions"/>.</param>
        /// <param name="operationalStoreOptions">The <see cref="IOptions{OperationalStoreOptions}"/>.</param>
        public AuthContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        { }
    }
}
