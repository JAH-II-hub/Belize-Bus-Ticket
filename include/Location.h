#ifndef LOCATION_H
#define LOCATION_H

#include <string>
#include <vector>

/**
 * @class Location
 * @brief Represents a location or stop in the Belize Bus Ticket System
 * 
 * Manages location information including stops along bus routes
 * and terminal locations for tellers.
 */
class Location {
private:
    int id;
    std::string name;
    std::string type; // "Terminal", "Stop", "City", etc.
    std::string address;
    std::string city;
    std::string state;
    std::string country;
    double latitude;
    double longitude;
    bool isActive;

public:
    // Constructors
    Location();
    Location(int id, const std::string& name, const std::string& type,
             const std::string& address, const std::string& city,
             const std::string& state, const std::string& country,
             double latitude, double longitude);
    
    // Destructor
    ~Location();

    // Getters
    int getId() const;
    std::string getName() const;
    std::string getType() const;
    std::string getAddress() const;
    std::string getCity() const;
    std::string getState() const;
    std::string getCountry() const;
    double getLatitude() const;
    double getLongitude() const;
    bool getIsActive() const;

    // Setters
    void setId(int id);
    void setName(const std::string& name);
    void setType(const std::string& type);
    void setAddress(const std::string& address);
    void setCity(const std::string& city);
    void setState(const std::string& state);
    void setCountry(const std::string& country);
    void setLatitude(double latitude);
    void setLongitude(double longitude);
    void setIsActive(bool isActive);

    // Location management methods
    bool isTerminal() const;
    bool isStop() const;
    bool isCity() const;
    bool isLocationActive() const;
    
    // Distance calculation
    double calculateDistance(const Location& other) const;
    double calculateDistance(double otherLat, double otherLon) const;
    
    // Validation methods
    bool validateCoordinates() const;
    bool validateAddress() const;
    bool validateName() const;
    
    // Utility methods
    void displayLocationInfo() const;
    std::string getFullAddress() const;
    std::string getLocationTypeString() const;
    
    // Static utility methods
    static double calculateDistanceBetweenPoints(double lat1, double lon1, 
                                               double lat2, double lon2);
    static bool isValidLatitude(double latitude);
    static bool isValidLongitude(double longitude);
};

#endif // LOCATION_H