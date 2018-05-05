using System.Collections.Generic;

public interface IUserService
{
    /*
        Create a new user in the system. This method acepts two users with the same name.
     */
    int CreateUser(string userName, int age, string city);

    /*
        Delete a user from the system.
        Return: true if deleted correctly. False otherwise
     */
    bool DeleteUser(User user);

    /*
        Find a user by ID
     */
    User FindUserWithId(int id);

    /*
        True if exits user with name {name}
     */
    bool ExitsUserWithName(string name);

    /*
        True if user ID belong to registered users
     */
    bool ExistsUserWithId(int id);

    /*
        Return all conected users
     */
    List<User> CurrentUsers();

}