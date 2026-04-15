#ifndef TELLER_H
#define TELLER_H

#include "User.h"
#include <vector>

/**
 * @class Teller
 * @brief Represents a ticket teller in the Belize Bus Ticket System
 * 
 * Inherits from User class and provides teller-specific functionality
 * such as selling tickets, managing bus schedules, and viewing sales reports.
 */
class Teller : public User {
private:
    std::string terminalLocation;
    std::string employeeId;
    std::vector<int> ticketsSold; // List of ticket IDs sold by this teller
    bool isAuthorized;
    double commissionRate;

public:
    // Constructors
    Teller();
    Teller(int id, const std::string& firstName, const std::string& lastName,
           const std::string& email, const std::string& password,
           const std::string& terminalLocation, const std::string& employeeId);
    
    // Destructor
    ~Teller();

    // Getters
    std::string getTerminalLocation() const;
    std::string getEmployeeId() const;
    std::vector<int> getTicketsSold() const;
    bool getIsAuthorized() const;
    double getCommissionRate() const;

    // Setters
    void setTerminalLocation(const std::string& terminalLocation);
    void setEmployeeId(const std::string& employeeId);
    void setIsAuthorized(bool isAuthorized);
    void setCommissionRate(double rate);

    // Teller-specific methods
    bool authenticate(const std::string& password) const override;
    void displayUserInfo() const override;
    bool validateEmail() const override;
    void performUserAction() override;
    
    // Ticket management
    void addTicketSold(int ticketId);
    void viewSalesHistory() const;
    double calculateCommission() const;
    
    // Authorization and permissions
    bool hasPermissionToSellTickets() const;
    bool hasPermissionToManageBuses() const;
    bool hasPermissionToViewReports() const;
    
    // Teller validation
    bool validateEmployeeId() const;
    bool isTerminalValid() const;
    
    // Utility methods
    void updateProfile(const std::string& firstName, const std::string& lastName,
                      const std::string& email, const std::string& terminalLocation);
    void authorizeTeller();
    void revokeAuthorization();
    void generateSalesReport() const;
};

#endif // TELLER_H