using System.Collections.Generic;

public interface IChatService
{
    // Create a private Room where several users can talk each others.
    IRoom CreatePrivateChat(List<User> users);

    // Find a room by a key
    IRoom FindRoom(int id);

    // True if exists a private chanel with the user {user}
    bool ExistsPrivateChatFromUser(User user);

    // Remove all channels with the user {user}.
    void RemovePrivateChatsFromUser(User user);
    
    // Return the public room
    IRoom UniversalRoom { get; }
    
    // Delete a room
    void RemoveChatRoom(IRoom room);
}