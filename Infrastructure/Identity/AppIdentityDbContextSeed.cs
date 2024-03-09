using Core.Entities.identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!userManager.Users.Any())
            {
                // Seed roles if they don't exist
                if (!await roleManager.RoleExistsAsync("User"))
                {
                    await roleManager.CreateAsync(new IdentityRole("User"));
                }
                if (!await roleManager.RoleExistsAsync("Admin"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                }

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

                // Create the user
                await userManager.CreateAsync(user, "Lozinka$123");

                // Assign the user a role (e.g., "User")
                await AssignUserToRole(userManager, user, "User");
            }
        }

        private static async Task AssignUserToRole(UserManager<AppUser> userManager, AppUser user, string roleName)
        {
            // Check if the user is already in the role
            var isInRole = await userManager.IsInRoleAsync(user, roleName);
            if (!isInRole)
            {
                // Add user to role
                await userManager.AddToRoleAsync(user, roleName);
            }
        }
    }
}
