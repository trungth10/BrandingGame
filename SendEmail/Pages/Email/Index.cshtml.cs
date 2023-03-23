using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Mail;

namespace SendEmail.Pages.Email
{
    public class IndexModel : PageModel
    {
		public class MyPageModel : PageModel
		{
			public void OnPost(string inputEmail)
			{
				MailMessage message = new MailMessage();
				message.To.Add(inputEmail);
				message.Subject = "Congratulations, you've won a prize!";
				message.Body = "Dear winner, congratulations on winning our prize!";

				SmtpClient client = new SmtpClient("your-smtp-server.com");
				client.Send(message);
			}
		}
		public void OnGet()
        {
        }
    }
}
