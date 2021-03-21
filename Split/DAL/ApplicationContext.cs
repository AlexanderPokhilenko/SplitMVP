using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Split.DAL.Models;

namespace Split.DAL
{
    public sealed class ApplicationContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Dialog> Dialogs { get; set; }
        public DbSet<DialogMember> DialogMembers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MultiAccount> MultiAccounts { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MultiAccount>().HasIndex(entity => entity.Email).IsUnique();
        }
    }
}
