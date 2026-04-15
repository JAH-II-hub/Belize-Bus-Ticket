#ifndef BUS_H
#define BUS_H

#include <string>
#include <vector>
#include <ctime>

/**
 * @enum BusType
 * @brief Enumeration for different types of buses
 */
enum class BusType {
    REGULAR,
    EXPRESS
};

/**
 * @class Bus
 * @brief Represents a bus in the Belize Bus Ticket System
 * 
 * Manages bus information including schedule, capacity, and type.
 * Provides functionality for seat management and availability checking.
 */
class Bus {
private:
    int id;
    std::string name;
    std::string busNumber;
    BusType type;
    int seatCapacity;
    int availableSeats;
    std::string departureLocation;
    std::string arrivalLocation;
    std::tm departureTime;
    std::tm arrivalTime;
    bool isActive;
    std::vector<int> stopIds; // IDs of stops along the route

public:
    // Constructors
    Bus();
    Bus(int id, const std::string& name, const std::string& busNumber,
        BusType type, int seatCapacity, const std::string& departureLocation,
        const std::string& arrivalLocation, const std::tm& departureTime,
        const std::tm& arrivalTime);
    
    // Destructor
    ~Bus();

    // Getters
    int getId() const;
    std::string getName() const;
    std::string getBusNumber() const;
    BusType getType() const;
    int getSeatCapacity() const;
    int getAvailableSeats() const;
    std::string getDepartureLocation() const;
    std::string getArrivalLocation() const;
    std::tm getDepartureTime() const;
    std::tm getArrivalTime() const;
    bool getIsActive() const;
    std::vector<int> getStopIds() const;

    // Setters
    void setId(int id);
    void setName(const std::string& name);
    void setBusNumber(const std::string& busNumber);
    void setType(BusType type);
    void setSeatCapacity(int seatCapacity);
    void setAvailableSeats(int availableSeats);
    void setDepartureLocation(const std::string& departureLocation);
    void setArrivalLocation(const std::string& arrivalLocation);
    void setDepartureTime(const std::tm& departureTime);
    void setArrivalTime(const std::tm& arrivalTime);
    void setIsActive(bool isActive);

    // Bus management methods
    bool isAvailable() const;
    bool hasAvailableSeats(int numberOfSeats) const;
    bool isExpressBus() const;
    bool isRegularBus() const;
    
    // Seat management
    bool reserveSeats(int numberOfSeats);
    bool releaseSeats(int numberOfSeats);
    double getOccupancyRate() const;
    
    // Schedule management
    bool isOnTime() const;
    bool isDelayed() const;
    int calculateTravelTime() const; // Returns travel time in minutes
    
    // Route management
    void addStop(int stopId);
    void removeStop(int stopId);
    bool hasStop(int stopId) const;
    int getNumberOfStops() const;
    
    // Validation methods
    bool validateBusNumber() const;
    bool validateSchedule() const;
    bool validateCapacity() const;
    
    // Utility methods
    void displayBusInfo() const;
    std::string getBusTypeString() const;
    std::string getFormattedDepartureTime() const;
    std::string getFormattedArrivalTime() const;
};

#endif // BUS_H