using System;

public class User : IComparable
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ConnectionId { get; set; }

    public int CompareTo(object obj)
    {
        if (obj == null) return 1;

        User otherUser = obj as User;
        if (otherUser != null)
            return Id.CompareTo(otherUser.Id);
        else
            throw new ArgumentException("Object is not a User");
    }
}
