using System.Collections.Generic;
public class PersonalRoom : Room
{
    public PersonalRoom(int id, List<User> members) : base(id, RoomType.Personal , members) {}
}
