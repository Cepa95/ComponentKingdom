using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }

        [Required]
        [RegularExpression("(?=^.{6,12}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$")]
        public string NewPassword { get; set; }
    }
}