using Core.Entities.identity;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
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

                if (!await roleManager.RoleExistsAsync("Admin"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                }

                await userManager.AddToRoleAsync(user, "Admin");

                var userData = await File.ReadAllTextAsync("C:/Users/Josip Čeprnić/Desktop/ComponentKingdom/Infrastructure/Data/SeedData/users.json");
                var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

                foreach (var newUser in users)
                {
                    await userManager.CreateAsync(newUser, "Lozinka$123");
                }
            }
        }
    }
}
