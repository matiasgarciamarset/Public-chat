using System.Collections.Generic;
public class UserService : IUserService
{
    private Dictionary<int, User> registeredUsers = new Dictionary<int, User>();
    private int nextUser = 0;

    public int CreateUser(string userName) {
        User newUser = new User(nextUser++,userName);
        registeredUsers.Add(newUser.Id, newUser);
        return newUser.Id;
    }

    public bool DeleteUser(User user) {
        if (registeredUsers.GetValueOrDefault(user.Id).Name == user.Name) {
            registeredUsers.Remove(user.Id);
            return true;
        }
        return false;
    }

    public User FindUserById(int id) {
        return registeredUsers.GetValueOrDefault(id);
    }

}