using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ChatWeb.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly IUserService _userService;

        public ChatHub(IChatService chatService, IUserService userService)
        {
            _chatService = chatService;
            _userService = userService;
        }

        public async Task RegisterInChats(int userId)
        {
            User user = _userService.FindUserWithId(userId);
            user.ConnectionId = Context.ConnectionId;

            //Register in public chat
            await Groups.AddAsync(user.ConnectionId, _chatService.UniversalRoom.Name);
        }

        public async Task<int> CreatePrivateChat(int currentUserId, int userIdToTalk)
        {
            User user1 = _userService.FindUserWithId(currentUserId);
            User user2 = _userService.FindUserWithId(userIdToTalk);

            if (user1 != null && user2 != null)
            {
                // Only one user at time
                if (!_chatService.ExistsPrivateChatFromUser(user2))
                {
                    var users = new List<User> { user1, user2 };
                    IRoom room = _chatService.CreatePrivateChat(users);
                    await Groups.AddAsync(user1.ConnectionId, room.Name);
                    await Groups.AddAsync(user2.ConnectionId, room.Name);
                    return room.Id;
                }
            }

            return -1;
        }

        public async Task ExitFromChat(int roomId, int userId)
        {
            User currentUser = _userService.FindUserWithId(userId);
            IRoom room = _chatService.FindRoom(roomId);

            if (currentUser != null && room != null)
            {
                await SendMessage(room.Id, userId, "< Left Chat >");
                room.RemoveUser(currentUser);

                if (room.UserCount <= 1)
                {
                    _chatService.RemoveChatRoom(room);
                }

                await Groups.RemoveAsync(currentUser.ConnectionId, room.Name);
            }
        }

        public async Task SendPublicMessage(int userId, string message)
        {
            User currentUser = _userService.FindUserWithId(userId);

            if (currentUser != null)
            {
                var universalRoomName = _chatService.UniversalRoom.Name;
                await Clients.Group(universalRoomName).SendAsync("ReceivePublicMessage", currentUser.Name, message);
            }
        }

        public async Task SendMessage(int roomId, int userId, string message)
        {
            User currentUser = _userService.FindUserWithId(userId);
            IRoom room = _chatService.FindRoom(roomId);

            if (currentUser != null && room != null && room.IsMember(currentUser))
            {
                var roomName = room.Name;
                await Clients.Group(roomName).SendAsync("ReceiveMessage", room.Id, currentUser.Name, message);
            }
        }

    }
}
