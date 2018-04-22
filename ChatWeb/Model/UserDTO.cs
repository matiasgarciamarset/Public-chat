public class UserDTO
{
    public int Id { get; set; }
    public string Name { get; set; }

    public UserDTO(int id, string name) {
        this.Id = id;
        this.Name = name;
    }

    public UserDTO(User user) {
        this.Id = user.Id;
        this.Name = user.Name;
    }
}
