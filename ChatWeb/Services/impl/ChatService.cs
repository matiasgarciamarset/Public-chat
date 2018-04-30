using System.Collections.Generic;
using System.Linq;

public class ChatService : IChatService
{
    private List<IRoom> activeRooms = new List<IRoom>();
    private IRoom publicRoom = new Room(0, RoomType.Universal, new List<User>());
    private int lastRoom = 1;

    public IRoom UniversalRoom => publicRoom;

    public IRoom CreatePrivateChat(List<User> users)
    {
        int currentId = lastRoom++;
        IRoom newRoom = new Room(currentId, RoomType.Personal, users);

        if (!activeRooms.Contains(newRoom))
        {
            activeRooms.Add(newRoom);
        }

        return newRoom;
    }

    public IRoom FindRoom(int id)
    {
        return publicRoom.Id == id ? publicRoom : activeRooms.FirstOrDefault(r => r.Id == id);
    }

    public bool ExistsPrivateChatFromUser(User user)
    {
        return RoomsWithUser(user).Any(r => r.Type == RoomType.Personal);
    }

    public void RemovePrivateChatsFromUser(User user)
    {
        foreach (var room in RoomsWithUser(user))
        {
            if (room.Type == RoomType.Personal)
            {
                RemoveChatRoom(room);
            }
        }
    }

    public void RemoveChatRoom(IRoom room)
    {
        activeRooms.Remove(room);
    }

    private List<IRoom> RoomsWithUser(User user)
    {
        return activeRooms.Where(r => r.IsMember(user)).ToList();
    }
}