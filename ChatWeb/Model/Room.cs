using System.Collections.Generic;
using System.Linq;

public class Room : IRoom
{
    protected int Id;
    protected RoomType Type;
    protected List<User> Members = new List<User>();

    public Room(int id, RoomType type, List<User> members) {
        Id = id;
        Type = type;
        Members = members;
    }

    public int UserCount => Members.Count;

    RoomType IRoom.Type => Type;

    int IRoom.Id => Id;

    public string Name
    {
        get
        {
            string result = "channel_" + Type.ToString() + "_";

            foreach (User user in Members.OrderBy(u => u.Id))
            {
                result += user.ConnectionId + "+";
            }
            return result;
        }
    }

    public bool IsMember(User user)
    {
        return Members.Contains(user);
    }

    public void RemoveUser(User user)
    {
        Members.Remove(user);
    }
}
