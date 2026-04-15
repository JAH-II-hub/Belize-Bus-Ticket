#ifndef USER_H
#define USER_H

#include <string>
#include <iostream>

/**
 * @class User
 * @brief Base class for all users in the Belize Bus Ticket System
 * 
 * This class provides common functionality and attributes for all user types
 * including customers and tellers. Implements polymorphism through virtual functions.
 */
class User {
protected:
    int id;
    std::string firstName;
    std::string lastName;
    std::string email;
    std::string password;
    std::string userType;

public:
    // Constructors
    User();
    User(int id, const std::string& firstName, const std::string& lastName, 
         const std::string& email, const std::string& password, const std::string& userType);
    
    // Virtual destructor for proper polymorphism
    virtual ~User();

    // Getters
    int getId() const;
    std::string getFirstName() const;
    std::string getLastName() const;
    std::string getEmail() const;
    std::string getPassword() const;
    std::string getUserType() const;

    // Setters
    void setId(int id);
    void setFirstName(const std::string& firstName);
    void setLastName(const std::string& lastName);
    void setEmail(const std::string& email);
    void setPassword(const std::string& password);
    void setUserType(const std::string& userType);

    // Virtual functions for polymorphism
    virtual bool authenticate(const std::string& password) const = 0;
    virtual void displayUserInfo() const = 0;
    virtual bool validateEmail() const = 0;
    
    // Utility functions
    std::string getFullName() const;
    bool isValidPassword(const std::string& password) const;
    
    // Pure virtual function for user-specific actions
    virtual void performUserAction() = 0;
};

#endif // USER_H