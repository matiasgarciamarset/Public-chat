using System.Collections.Generic;
public class Room : IRoom
{
    public int Id;
    public RoomType Type;
    public List<User> Members = new List<User>();

    public Room(int id, RoomType type, List<User> members) {
        this.Id = id;
        this.Type = type;
        this.Members = members;
    }

    public virtual bool IsMember(User user) {
        return Members.Contains(user);
    }

    public virtual void RemoveUser(User user) {
        Members.Remove(user);
    }

    public virtual int CountUsers() {
        return Members.Count;
    }

    public int getId() {
        return this.Id;
    }

    public RoomType getRoomType() {
        return this.Type;
    }

    public string getRoomName() {
        Members.Sort();
        string result = "channel_" + Type.ToString() + "_";
        foreach(User user in Members) {
            result += user.ConnectionId + "+";
        }
        return result;
    }
}
