public class User
{
    public int Id { get; private set; }
    public string Name { get; private set; }

    public User(int id, string name) {
        this.Id = id;
        this.Name = name;
    }
}
