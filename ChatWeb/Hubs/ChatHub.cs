﻿using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatWeb.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly IUserService _userService;

        public ChatHub(IChatService chatService, IUserService userService) {
            _chatService = chatService;
            _userService = userService;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
