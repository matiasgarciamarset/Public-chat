using System.Collections.Generic;
public class UserService : IUserService
{
    private Dictionary<int, User> registeredUsers = new Dictionary<int, User>();
    private int lastId = 0;

    public int CreateUser(string userName) {
        int currentValue = lastId++;
        User newUser = new User(currentValue, userName);
        registeredUsers.Add(currentValue, newUser);
        return currentValue;
    }

    public bool DeleteUser(User user) {
        if (ExistsUserWithId(user.Id)) {
            registeredUsers.Remove(user.Id);
            return true;
        }
        return false;
    }

    public bool ExitsUserWithName(string name) {
        foreach(KeyValuePair<int,User> userEntry in registeredUsers) {
            if (userEntry.Value.Name.Equals(name)) {
                return true;
            }
        }
        return false;
    }

    public User FindUserWithId(int id) {
        //TODO: Not sure if return null or doesn't
        return registeredUsers.GetValueOrDefault(id);
    }

    public bool ExistsUserWithId(int id) {
        return registeredUsers.ContainsKey(id);
    }

    public User[] CurrentUsers() {
        User[] users = new User[registeredUsers.Values.Count];
        registeredUsers.Values.CopyTo(users,0);
        return users;
    }


}