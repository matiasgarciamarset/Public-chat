using System.Collections.Generic;
public class UniversalRoom : Room
{
    public UniversalRoom(int id) : base(id, RoomType.Universal , new List<User>()) {}

    public override bool IsMember(User user) {
        return true;
    }
    public override void RemoveUser(User user){ }
    public override int CountUsers() {
        return 1000;
    }
}
