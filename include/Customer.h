#ifndef CUSTOMER_H
#define CUSTOMER_H

#include "User.h"
#include <vector>

/**
 * @class Customer
 * @brief Represents a customer in the Belize Bus Ticket System
 * 
 * Inherits from User class and provides customer-specific functionality
 * such as ticket booking and viewing booking history.
 */
class Customer : public User {
private:
    std::string phoneNumber;
    std::string address;
    std::vector<int> ticketHistory; // List of ticket IDs purchased by this customer
    bool isActive;

public:
    // Constructors
    Customer();
    Customer(int id, const std::string& firstName, const std::string& lastName,
             const std::string& email, const std::string& password,
             const std::string& phoneNumber, const std::string& address);
    
    // Destructor
    ~Customer();

    // Getters
    std::string getPhoneNumber() const;
    std::string getAddress() const;
    std::vector<int> getTicketHistory() const;
    bool getIsActive() const;

    // Setters
    void setPhoneNumber(const std::string& phoneNumber);
    void setAddress(const std::string& address);
    void setIsActive(bool isActive);

    // Customer-specific methods
    bool authenticate(const std::string& password) const override;
    void displayUserInfo() const override;
    bool validateEmail() const override;
    void performUserAction() override;
    
    // Ticket management
    void addTicketToHistory(int ticketId);
    void viewBookingHistory() const;
    bool canBookTicket() const;
    
    // Customer validation
    bool validatePhoneNumber() const;
    bool isAccountActive() const;
    
    // Utility methods
    void updateProfile(const std::string& firstName, const std::string& lastName,
                      const std::string& email, const std::string& phoneNumber,
                      const std::string& address);
    void deactivateAccount();
    void reactivateAccount();
};

#endif // CUSTOMER_H