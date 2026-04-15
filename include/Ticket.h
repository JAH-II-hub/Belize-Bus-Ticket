#ifndef TICKET_H
#define TICKET_H

#include <string>
#include <ctime>
#include <vector>

/**
 * @enum TicketStatus
 * @brief Enumeration for ticket status
 */
enum class TicketStatus {
    AVAILABLE,
    BOOKED,
    CONFIRMED,
    CANCELLED,
    EXPIRED
};

/**
 * @class Ticket
 * @brief Represents a bus ticket in the Belize Bus Ticket System
 * 
 * Manages ticket information including booking details, pricing, and status.
 * Links customers, tellers, and buses through their respective IDs.
 */
class Ticket {
private:
    int id;
    int busId;
    int customerId;
    int tellerId;
    std::string destination;
    std::tm travelDate;
    std::tm bookingDate;
    int numberOfSeats;
    double price;
    double totalPrice;
    TicketStatus status;
    std::string seatNumbers;
    std::string bookingReference;
    bool isRoundTrip;
    std::tm returnDate;

public:
    // Constructors
    Ticket();
    Ticket(int id, int busId, int customerId, int tellerId,
           const std::string& destination, const std::tm& travelDate,
           int numberOfSeats, double price, bool isRoundTrip = false);
    
    // Destructor
    ~Ticket();

    // Getters
    int getId() const;
    int getBusId() const;
    int getCustomerId() const;
    int getTellerId() const;
    std::string getDestination() const;
    std::tm getTravelDate() const;
    std::tm getBookingDate() const;
    int getNumberOfSeats() const;
    double getPrice() const;
    double getTotalPrice() const;
    TicketStatus getStatus() const;
    std::string getSeatNumbers() const;
    std::string getBookingReference() const;
    bool getIsRoundTrip() const;
    std::tm getReturnDate() const;

    // Setters
    void setId(int id);
    void setBusId(int busId);
    void setCustomerId(int customerId);
    void setTellerId(int tellerId);
    void setDestination(const std::string& destination);
    void setTravelDate(const std::tm& travelDate);
    void setBookingDate(const std::tm& bookingDate);
    void setNumberOfSeats(int numberOfSeats);
    void setPrice(double price);
    void setTotalPrice(double totalPrice);
    void setStatus(TicketStatus status);
    void setSeatNumbers(const std::string& seatNumbers);
    void setBookingReference(const std::string& bookingReference);
    void setIsRoundTrip(bool isRoundTrip);
    void setReturnDate(const std::tm& returnDate);

    // Ticket management methods
    bool bookTicket();
    bool confirmTicket();
    bool cancelTicket();
    bool isExpired() const;
    bool isConfirmed() const;
    bool isBooked() const;
    
    // Pricing methods
    void calculateTotalPrice();
    double calculateDiscount(double discountRate) const;
    double calculateCommission(double commissionRate) const;
    
    // Validation methods
    bool validateTicket() const;
    bool validateSeatNumbers() const;
    bool validateBookingReference() const;
    
    // Date and time methods
    int daysUntilTravel() const;
    bool isTravelDateValid() const;
    bool isBookingDateValid() const;
    
    // Utility methods
    void generateBookingReference();
    std::string getTicketStatusString() const;
    std::string getFormattedTravelDate() const;
    std::string getFormattedBookingDate() const;
    void displayTicketInfo() const;
    
    // Round trip methods
    bool hasReturnDate() const;
    void setReturnDate(const std::tm& returnDate);
    double calculateRoundTripPrice(double returnPrice) const;
};

#endif // TICKET_H