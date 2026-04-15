#ifndef BUSSYSTEM_H
#define BUSSYSTEM_H

#include <string>
#include <vector>
#include <memory>
#include "User.h"
#include "Customer.h"
#include "Teller.h"
#include "Bus.h"
#include "Ticket.h"
#include "Location.h"
#include "DatabaseManager.h"

/**
 * @class BusSystem
 * @brief Main controller class for the Belize Bus Ticket System
 * 
 * Acts as the central controller that coordinates all operations
 * including user management, ticket booking, and system administration.
 */
class BusSystem {
private:
    std::unique_ptr<DatabaseManager> dbManager;
    std::string systemName;
    std::string version;
    bool isInitialized;
    
    // Current session information
    std::unique_ptr<User> currentUser;
    std::string sessionToken;

public:
    // Constructors
    BusSystem();
    BusSystem(const std::string& systemName, const std::string& version);
    
    // Destructor
    ~BusSystem();

    // System initialization
    bool initialize();
    bool shutdown();
    bool isSystemInitialized() const;
    
    // User authentication and session management
    bool login(const std::string& email, const std::string& password);
    bool logout();
    bool registerUser(const User& user);
    bool changePassword(const std::string& oldPassword, const std::string& newPassword);
    bool validateSession() const;
    
    // Customer operations
    bool registerCustomer(const Customer& customer);
    bool bookTicket(int customerId, int busId, const std::string& destination,
                   const std::tm& travelDate, int numberOfSeats, bool isRoundTrip = false);
    bool cancelTicket(int ticketId);
    bool modifyBooking(int ticketId, int newBusId, const std::tm& newTravelDate);
    std::vector<std::unique_ptr<Ticket>> viewCustomerTickets(int customerId);
    std::vector<std::unique_ptr<Bus>> searchBuses(const std::string& destination,
                                                 const std::tm& travelDate);
    
    // Teller operations
    bool sellTicket(int tellerId, int customerId, int busId, const std::string& destination,
                   const std::tm& travelDate, int numberOfSeats);
    bool processRefund(int tellerId, int ticketId);
    std::vector<std::unique_ptr<Ticket>> viewTellerSales(int tellerId);
    std::vector<std::unique_ptr<Ticket>> viewDailySales(const std::tm& date);
    
    // Bus management
    bool addBus(const Bus& bus);
    bool updateBus(const Bus& bus);
    bool removeBus(int busId);
    bool updateBusAvailability(int busId, bool isActive);
    std::vector<std::unique_ptr<Bus>> getAvailableBuses(const std::string& destination,
                                                       const std::tm& travelDate);
    
    // Location management
    bool addLocation(const Location& location);
    bool updateLocation(const Location& location);
    bool removeLocation(int locationId);
    std::vector<std::unique_ptr<Location>> getLocationsByType(const std::string& type);
    
    // Reporting and analytics
    double getDailyRevenue(const std::tm& date);
    double getMonthlyRevenue(int year, int month);
    double getAnnualRevenue(int year);
    std::vector<std::pair<std::string, int>> getPopularRoutes();
    std::vector<std::pair<std::string, int>> getBusOccupancy();
    std::vector<std::pair<std::string, double>> getTellerCommissions();
    
    // System administration
    bool backupSystem(const std::string& backupPath);
    bool restoreSystem(const std::string& backupPath);
    bool runSystemCheck();
    bool generateSystemReport();
    
    // Utility methods
    std::string getSystemStatus() const;
    std::string getSystemVersion() const;
    std::string getSystemName() const;
    User* getCurrentUser() const;
    std::string getSessionToken() const;
    
    // Validation methods
    bool validateCustomerData(const Customer& customer);
    bool validateTellerData(const Teller& teller);
    bool validateBusData(const Bus& bus);
    bool validateTicketData(const Ticket& ticket);
    bool validateLocationData(const Location& location);
    
    // Search and filtering
    std::vector<std::unique_ptr<Customer>> searchCustomers(const std::string& searchTerm);
    std::vector<std::unique_ptr<Teller>> searchTellers(const std::string& searchTerm);
    std::vector<std::unique_ptr<Bus>> searchBuses(const std::string& searchTerm);
    std::vector<std::unique_ptr<Ticket>> searchTickets(const std::string& searchTerm);
    std::vector<std::unique_ptr<Location>> searchLocations(const std::string& searchTerm);
};

#endif // BUSSYSTEM_H