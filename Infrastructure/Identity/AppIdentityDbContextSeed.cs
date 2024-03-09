using Core.Entities.identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Josip",
                    Email = "ceprnic.josip@gmail.com",
                    UserName = "ceprnic.josip@gmail.com",
                    Address = new Address
                    {
                        FirstName = "Josip",
                        LastName = "Ceprnic",
                        Street = "ulica 45",
                        City = "Split",
                        State = "Croatia",
                        ZipCode = "21000"
                    }

                };

                await userManager.CreateAsync(user, "Lozinka$123");
            }

        }

    }
}