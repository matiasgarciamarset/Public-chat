using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatWeb.Hubs
{
    public class UserHub : Hub
    {
        private readonly IUserService _userService;

        public UserHub(IUserService userService) {
            _userService = userService;
        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
