using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatWeb.Hubs
{
    public class UserHub : Hub
    {
        private readonly IChatService _chatService;

        private readonly IUserService _userService;

        public UserHub(IChatService chatService, IUserService userService)
        {
            _chatService = chatService;
            _userService = userService;
        }

        public async Task<int> LoginUser(string userName, int age, string city)
        {
            if (!_userService.ExitsUserWithName(userName))
            {
                int id = _userService.CreateUser(userName, age, city);
                await Clients.All.SendAsync("RefreshUsers");
                await CurrentUsers();
                return id;
            }

            return -1;
        }

        public async Task LogoutUser(int id)
        {
            User user = _userService.FindUserWithId(id);
            if (user != null)
            {
                _chatService.RemovePrivateChatsFromUser(user);
                _userService.DeleteUser(user);
                await CurrentUsers();
            }
        }

        public async Task CurrentUsers()
        {
            foreach (User user in _userService.CurrentUsers())
            {
                await Clients.All.SendAsync("LoadUsers", user.Id, user.Name, user.Age, user.City);
            }
        }
    }
}
