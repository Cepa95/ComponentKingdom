using API.Dtos;
using API.Errors;
using Core.Entities.identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using API.Extensions;
using AutoMapper;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        private readonly ILogger<AccountController> _logger;


        public AccountController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService,
        IMapper mapper,
        ILogger<AccountController> logger)
        {

            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
            _logger = logger;

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            _logger.LogInformation("Login attempt for {Email}", loginDto.Email);

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };

        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            _logger.LogInformation("Register attempt for {Email}", registerDto.Email);

            if (CheckEmailExists(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                {
                    Errors = ["Email already exists"]
                });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [HttpGet]
        [Authorize]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {

            _logger.LogInformation("Getting user details");

            var user = await _userManager.FindByEmailFromClaimPrincipleWithAddress(User);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<Boolean>> CheckEmailExists([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [HttpGet("address")]
        [Authorize]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            _logger.LogInformation("Getting user address");

            var user = await _userManager.FindUserByClaimPrincipleWithAddress(User);

            return _mapper.Map<Address, AddressDto>(user.Address);
        }

        [HttpPut("address")]
        [Authorize]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            _logger.LogInformation("Updating user address");

            var user = await _userManager.FindUserByClaimPrincipleWithAddress(HttpContext.User);

            user.Address = _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Ok(_mapper.Map<AddressDto>(user.Address));

            return BadRequest("Problem updating the user");
        }

        [HttpPost("changePassword")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            _logger.LogInformation("Changing user password");

            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return NotFound("User not found");

            if (changePasswordDto.NewPassword == changePasswordDto.CurrentPassword)
                return BadRequest("New password cannot be the same as the current password");

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

            if (result.Succeeded) return Ok("Password changed successfully");

            return BadRequest("Error changing password");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("address/{userId}")]
        public async Task<ActionResult> UpdateAddressByUserId(string userId, AddressDto addressDto)
        {
            _logger.LogInformation($"Updating address for user with ID: {userId}");

            userId = userId.Trim().ToLower();

            var user = await _userManager.Users
                .Include(u => u.Address)
                .Where(u => u.Id.Trim().ToLower() == userId)
                .SingleOrDefaultAsync();

            if (user == null) return NotFound(new ApiResponse(404, "User not found"));

            if (user.Address == null) return NotFound(new ApiResponse(404, "Address not found"));

            _mapper.Map(addressDto, user.Address);

            try
            {
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded) return BadRequest(new ApiResponse(400, "Failed to update address"));

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "An error occurred while updating the address");
                return StatusCode(500, new ApiResponse(500, ex.InnerException?.Message));
            }
        }




    }

}
