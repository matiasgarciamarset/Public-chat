using System.Collections.Generic;
using System.Linq;

public class UserService : IUserService
{
    private List<User> registeredUsers = new List<User>();
    private int lastId = 0;

    public int CreateUser(string userName, int age, string city) {
        int currentValue = lastId++;

        registeredUsers.Add(new User
        {
            Id = currentValue,
            Name = userName,
            Age = age, 
            City = city
        });

        return currentValue;
    }

    public bool DeleteUser(User user) {
        if (ExistsUserWithId(user.Id))
        {
            registeredUsers.Remove(user);
            return true;
        }

        return false;
    }

    public bool ExitsUserWithName(string name) {
        return registeredUsers.Any(u => u.Name == name);
    }

    public User FindUserWithId(int id) {
        return registeredUsers.FirstOrDefault(u => u.Id == id);
    }

    public bool ExistsUserWithId(int id) {
        return registeredUsers.Any(u => u.Id == id);
    }

    public List<User> CurrentUsers() {
        return registeredUsers;
    }
}