#ifndef DATABASEMANAGER_H
#define DATABASEMANAGER_H

#include <string>
#include <vector>
#include <memory>
#include "User.h"
#include "Customer.h"
#include "Teller.h"
#include "Bus.h"
#include "Ticket.h"
#include "Location.h"

/**
 * @class DatabaseManager
 * @brief Manages database connections and operations for the Belize Bus Ticket System
 * 
 * Provides an interface for all database operations including CRUD operations
 * for all entities in the system. Uses SQL for database interactions.
 */
class DatabaseManager {
private:
    std::string connectionString;
    bool isConnected;
    
    // SQL connection handle (implementation-specific)
    void* connectionHandle;

public:
    // Constructors
    DatabaseManager();
    DatabaseManager(const std::string& connectionString);
    
    // Destructor
    ~DatabaseManager();

    // Connection management
    bool connect();
    bool disconnect();
    bool isConnectedToDatabase() const;
    bool testConnection() const;

    // User management
    bool createUser(const User& user);
    std::unique_ptr<User> getUser(int id);
    std::vector<std::unique_ptr<User>> getAllUsers();
    bool updateUser(const User& user);
    bool deleteUser(int id);
    
    // Customer management
    bool createCustomer(const Customer& customer);
    std::unique_ptr<Customer> getCustomer(int id);
    std::vector<std::unique_ptr<Customer>> getAllCustomers();
    bool updateCustomer(const Customer& customer);
    bool deleteCustomer(int id);
    std::vector<std::unique_ptr<Ticket>> getCustomerTickets(int customerId);
    
    // Teller management
    bool createTeller(const Teller& teller);
    std::unique_ptr<Teller> getTeller(int id);
    std::vector<std::unique_ptr<Teller>> getAllTellers();
    bool updateTeller(const Teller& teller);
    bool deleteTeller(int id);
    std::vector<std::unique_ptr<Ticket>> getTellerTickets(int tellerId);
    
    // Bus management
    bool createBus(const Bus& bus);
    std::unique_ptr<Bus> getBus(int id);
    std::vector<std::unique_ptr<Bus>> getAllBuses();
    bool updateBus(const Bus& bus);
    bool deleteBus(int id);
    std::vector<std::unique_ptr<Bus>> getAvailableBuses(const std::string& destination, 
                                                       const std::tm& travelDate);
    std::vector<std::unique_ptr<Bus>> getBusesByType(BusType type);
    
    // Ticket management
    bool createTicket(const Ticket& ticket);
    std::unique_ptr<Ticket> getTicket(int id);
    std::vector<std::unique_ptr<Ticket>> getAllTickets();
    bool updateTicket(const Ticket& ticket);
    bool deleteTicket(int id);
    std::vector<std::unique_ptr<Ticket>> getTicketsByBus(int busId);
    std::vector<std::unique_ptr<Ticket>> getTicketsByCustomer(int customerId);
    std::vector<std::unique_ptr<Ticket>> getTicketsByTeller(int tellerId);
    std::vector<std::unique_ptr<Ticket>> getTicketsByDate(const std::tm& date);
    std::vector<std::unique_ptr<Ticket>> getTicketsByStatus(TicketStatus status);
    
    // Location management
    bool createLocation(const Location& location);
    std::unique_ptr<Location> getLocation(int id);
    std::vector<std::unique_ptr<Location>> getAllLocations();
    bool updateLocation(const Location& location);
    bool deleteLocation(int id);
    std::vector<std::unique_ptr<Location>> getLocationsByType(const std::string& type);
    std::vector<std::unique_ptr<Location>> getLocationsByCity(const std::string& city);
    
    // Advanced queries
    double calculateTotalRevenue() const;
    double calculateTotalRevenueByDate(const std::tm& date) const;
    double calculateTotalRevenueByBus(int busId) const;
    double calculateTotalRevenueByTeller(int tellerId) const;
    int getTotalTicketsSold() const;
    int getTotalCustomers() const;
    int getTotalBuses() const;
    
    // Reporting methods
    std::vector<std::pair<std::string, int>> getPopularDestinations() const;
    std::vector<std::pair<std::string, int>> getBusUtilization() const;
    std::vector<std::pair<std::string, double>> getTellerPerformance() const;
    
    // Utility methods
    bool executeQuery(const std::string& query);
    bool executeUpdate(const std::string& query);
    std::vector<std::vector<std::string>> executeSelect(const std::string& query);
    
    // Transaction management
    bool beginTransaction();
    bool commitTransaction();
    bool rollbackTransaction();
    
    // Database maintenance
    bool backupDatabase(const std::string& backupPath);
    bool restoreDatabase(const std::string& backupPath);
    bool optimizeDatabase();
    bool validateDatabaseIntegrity();
};

#endif // DATABASEMANAGER_H