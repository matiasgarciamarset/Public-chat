using System;

public class User : IComparable<User>
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string ConnectionId {get; set;}

    public User(int id, string name, string connectionId) {
        this.Id = id;
        this.Name = name;
        this.ConnectionId = connectionId;
    }

    public User(int id, string name) {
        this.Id = id;
        this.Name = name;
    }

    public override bool Equals(object obj)
    {
        var item = obj as User;
        if (item == null)
        {
            return false;
        }
        return this.Id.Equals(item.Id);
    }

    public override int GetHashCode()
    {
        return this.Id.GetHashCode();
    }

    public int CompareTo(User compareUser)
    {
        if (compareUser == null) {
            return 0;
        } else {
            return this.Id.CompareTo(compareUser.Id);
        }
    }
}
