using System.Collections.Generic;

public class ChatService : IChatService
{
    private List<IRoom> activeRooms = new List<IRoom>();
    private IRoom publicRoom = new UniversalRoom(0);
    private int lastRoom = 1;

    public IRoom getUniversalRoom() {
        return publicRoom;
    }

    public IRoom CreatePrivateChat(List<User> users) {
        int currentId = lastRoom++;
        IRoom newRoom = new PersonalRoom(currentId, users);
        if (!activeRooms.Contains(newRoom)) {
            activeRooms.Add(newRoom);
        }
        return newRoom;
    }

    public IRoom FindRoom(int id) {
        if (publicRoom.getId().Equals(id)) {
            return publicRoom;
        }
        foreach(IRoom room in activeRooms) {
            if (room.getId().Equals(id)) {
                return room;
            }
        }
        return null;
    }

    public bool ExistsPrivateChatFromUser(User user) {
        List<IRoom> rooms = roomsWithUser(user);
        foreach(IRoom room in rooms) {
            if (RoomType.Personal.Equals(room.getRoomType())) {
                return true;
            }
        }
        return false;
    }

    public void RemovePrivateChatsFromhUser(User user) {
        List<IRoom> rooms = roomsWithUser(user);
        foreach(IRoom room in rooms) {
            if (room.GetType().Equals(RoomType.Personal)) {
                RemoveChatRoom(room);
            }
        }
    }

    public void RemoveChatRoom(IRoom room) {
        activeRooms.Remove(room);
    }

    private List<IRoom> roomsWithUser(User user) {
        List<IRoom> list = new List<IRoom>();
        foreach(IRoom room in activeRooms) {
            if (room.IsMember(user)) {
                list.Add(room);
            }
        }
        return list;
    }

}