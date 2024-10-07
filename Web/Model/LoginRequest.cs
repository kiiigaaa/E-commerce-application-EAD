namespace Web.Model
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequestMail
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
