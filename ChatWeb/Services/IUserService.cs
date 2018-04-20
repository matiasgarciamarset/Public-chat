public interface IUserService
{
    /*
        Create a new user in the system
     */
    int CreateUser(string userName);
    /*
        Delete a user from the system.
        Return: true if deleted correctly. False otherwise
     */
    bool DeleteUser(User user);
    /*
        Find a user by ID
     */
    User FindUserById(int id);

}