public interface IRoom
{
    /*
        Return unique group ID
     */
    int getId();
    /*
        True if user belong to the Room
     */
    bool IsMember(User user);

    /*
        Return an Room name
     */
    string getRoomName();
    /*
        Remove user from the room
     */
    void RemoveUser(User user);
    /*
        Count users in room
    */
    int CountUsers();
    /*
        Return room type
     */
     RoomType getRoomType();
}
