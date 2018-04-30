public interface IRoom
{
    // Return unique group ID
    int Id { get; }

    /*
        True if user belong to the Room
     */
    bool IsMember(User user);

    /*
        Return an Room name
     */
    string Name { get; }

    /*
        Remove user from the room
     */
    void RemoveUser(User user);
    /*
        Count users in room
    */
    int UserCount { get;  }

    /*
        Return room type
     */
     RoomType Type { get; }
}
