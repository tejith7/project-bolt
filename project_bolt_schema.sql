-- Create Database for Project Bolt
CREATE DATABASE ProjectBolt;
GO

USE ProjectBolt;
GO

-- User Accounts Table
CREATE TABLE UserAccounts (
    AccountID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    DateOfBirth DATE NOT NULL,
    AccountType NVARCHAR(20) NOT NULL CHECK (AccountType IN ('Rider', 'Driver', 'Admin')),
    ProfileImageURL NVARCHAR(255),
    AccountStatus NVARCHAR(20) DEFAULT 'Active' CHECK (AccountStatus IN ('Active', 'Suspended', 'Inactive')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    LastLoginAt DATETIME,
    IsEmailVerified BIT DEFAULT 0,
    IsPhoneVerified BIT DEFAULT 0
);

-- Driver Profiles Table
CREATE TABLE DriverProfiles (
    DriverProfileID INT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT FOREIGN KEY REFERENCES UserAccounts(AccountID),
    DriverLicenseNumber NVARCHAR(50) NOT NULL UNIQUE,
    LicenseExpiryDate DATE NOT NULL,
    VehicleRegistrationNumber NVARCHAR(20) NOT NULL UNIQUE,
    VehicleMake NVARCHAR(50) NOT NULL,
    VehicleModel NVARCHAR(50) NOT NULL,
    VehicleYear INT NOT NULL,
    VehicleColor NVARCHAR(30) NOT NULL,
    VehicleType NVARCHAR(30) NOT NULL CHECK (VehicleType IN ('Sedan', 'SUV', 'Luxury', 'Van')),
    VehicleSeats INT NOT NULL,
    InsuranceProvider NVARCHAR(100) NOT NULL,
    InsurancePolicyNumber NVARCHAR(50) NOT NULL,
    InsuranceExpiryDate DATE NOT NULL,
    BackgroundCheckStatus NVARCHAR(20) DEFAULT 'Pending' CHECK (BackgroundCheckStatus IN ('Pending', 'Approved', 'Rejected')),
    VerificationStatus NVARCHAR(20) DEFAULT 'Pending' CHECK (VerificationStatus IN ('Pending', 'Verified', 'Rejected')),
    AverageRating DECIMAL(3,2) DEFAULT 0.00,
    TotalTrips INT DEFAULT 0,
    TotalEarnings DECIMAL(10,2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Addresses Table
CREATE TABLE Addresses (
    AddressID INT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT FOREIGN KEY REFERENCES UserAccounts(AccountID),
    AddressType NVARCHAR(20) NOT NULL CHECK (AddressType IN ('Home', 'Work', 'Other')),
    StreetAddress NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(20) NOT NULL,
    Latitude DECIMAL(10,8) NOT NULL,
    Longitude DECIMAL(11,8) NOT NULL,
    IsDefault BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Ride Bookings Table
CREATE TABLE RideBookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    RiderID INT FOREIGN KEY REFERENCES UserAccounts(AccountID),
    DriverID INT FOREIGN KEY REFERENCES DriverProfiles(DriverProfileID),
    PickupAddressID INT FOREIGN KEY REFERENCES Addresses(AddressID),
    DropoffAddressID INT FOREIGN KEY REFERENCES Addresses(AddressID),
    BookingStatus NVARCHAR(20) NOT NULL CHECK (BookingStatus IN ('Requested', 'Accepted', 'InProgress', 'Completed', 'Cancelled', 'NoShow')),
    RequestedPickupTime DATETIME NOT NULL,
    ActualPickupTime DATETIME,
    ActualDropoffTime DATETIME,
    EstimatedDistance DECIMAL(10,2) NOT NULL, -- in kilometers
    EstimatedDuration INT NOT NULL, -- in minutes
    BaseFare DECIMAL(10,2) NOT NULL,
    DistanceFare DECIMAL(10,2) NOT NULL,
    TimeFare DECIMAL(10,2) NOT NULL,
    SurgeMultiplier DECIMAL(3,2) DEFAULT 1.00,
    TotalFare DECIMAL(10,2) NOT NULL,
    PaymentStatus NVARCHAR(20) DEFAULT 'Pending' CHECK (PaymentStatus IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    CancellationReason NVARCHAR(255),
    CancelledBy NVARCHAR(20) CHECK (CancelledBy IN ('Rider', 'Driver', 'System')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Ride Tracking Table
CREATE TABLE RideTracking (
    TrackingID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT FOREIGN KEY REFERENCES RideBookings(BookingID),
    DriverLocationID INT FOREIGN KEY REFERENCES Addresses(AddressID),
    TrackingTimestamp DATETIME DEFAULT GETDATE(),
    CurrentLatitude DECIMAL(10,8) NOT NULL,
    CurrentLongitude DECIMAL(11,8) NOT NULL,
    CurrentSpeed DECIMAL(5,2), -- in km/h
    Bearing DECIMAL(5,2), -- in degrees
    EstimatedArrivalTime DATETIME,
    DistanceRemaining DECIMAL(10,2), -- in kilometers
    TimeRemaining INT -- in minutes
);

-- Payments Table
CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT FOREIGN KEY REFERENCES RideBookings(BookingID),
    PaymentMethod NVARCHAR(50) NOT NULL CHECK (PaymentMethod IN ('CreditCard', 'DebitCard', 'UPI', 'Wallet', 'Cash')),
    PaymentAmount DECIMAL(10,2) NOT NULL,
    PaymentCurrency NVARCHAR(3) DEFAULT 'USD',
    PaymentStatus NVARCHAR(20) NOT NULL CHECK (PaymentStatus IN ('Pending', 'Processing', 'Completed', 'Failed', 'Refunded')),
    TransactionID NVARCHAR(100),
    PaymentGateway NVARCHAR(50),
    PaymentTimestamp DATETIME DEFAULT GETDATE(),
    RefundAmount DECIMAL(10,2),
    RefundReason NVARCHAR(255),
    RefundTimestamp DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Ride Ratings Table
CREATE TABLE RideRatings (
    RatingID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT FOREIGN KEY REFERENCES RideBookings(BookingID),
    RatedByID INT FOREIGN KEY REFERENCES UserAccounts(AccountID),
    RatedUserID INT FOREIGN KEY REFERENCES UserAccounts(AccountID),
    Rating DECIMAL(2,1) NOT NULL CHECK (Rating BETWEEN 1.0 AND 5.0),
    RatingCategory NVARCHAR(20) NOT NULL CHECK (RatingCategory IN ('Cleanliness', 'Punctuality', 'Courtesy', 'Safety', 'Overall')),
    Comments NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Driver Earnings Table
CREATE TABLE DriverEarnings (
    EarningID INT IDENTITY(1,1) PRIMARY KEY,
    DriverID INT FOREIGN KEY REFERENCES DriverProfiles(DriverProfileID),
    BookingID INT FOREIGN KEY REFERENCES RideBookings(BookingID),
    BaseEarning DECIMAL(10,2) NOT NULL,
    Tips DECIMAL(10,2) DEFAULT 0.00,
    SurgeBonus DECIMAL(10,2) DEFAULT 0.00,
    PlatformFee DECIMAL(10,2) NOT NULL,
    NetEarning DECIMAL(10,2) NOT NULL,
    PaymentStatus NVARCHAR(20) DEFAULT 'Pending' CHECK (PaymentStatus IN ('Pending', 'Processing', 'Paid')),
    PaymentDate DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Promo Codes Table
CREATE TABLE PromoCodes (
    PromoCodeID INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NOT NULL,
    DiscountType NVARCHAR(20) NOT NULL CHECK (DiscountType IN ('Percentage', 'FixedAmount')),
    DiscountValue DECIMAL(10,2) NOT NULL,
    MinRideValue DECIMAL(10,2),
    MaxDiscountAmount DECIMAL(10,2),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    UsageLimit INT,
    UsageCount INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Promo Code Usage Table
CREATE TABLE PromoCodeUsage (
    UsageID INT IDENTITY(1,1) PRIMARY KEY,
    PromoCodeID INT FOREIGN KEY REFERENCES PromoCodes(PromoCodeID),
    AccountID INT FOREIGN KEY REFERENCES UserAccounts(AccountID),
    BookingID INT FOREIGN KEY REFERENCES RideBookings(BookingID),
    DiscountApplied DECIMAL(10,2) NOT NULL,
    UsedAt DATETIME DEFAULT GETDATE()
);

-- Create Indexes
CREATE INDEX IX_UserAccounts_Email ON UserAccounts(Email);
CREATE INDEX IX_UserAccounts_PhoneNumber ON UserAccounts(PhoneNumber);
CREATE INDEX IX_DriverProfiles_LicenseNumber ON DriverProfiles(DriverLicenseNumber);
CREATE INDEX IX_DriverProfiles_VerificationStatus ON DriverProfiles(VerificationStatus);
CREATE INDEX IX_RideBookings_RiderID ON RideBookings(RiderID);
CREATE INDEX IX_RideBookings_DriverID ON RideBookings(DriverID);
CREATE INDEX IX_RideBookings_BookingStatus ON RideBookings(BookingStatus);
CREATE INDEX IX_Payments_TransactionID ON Payments(TransactionID);
CREATE INDEX IX_RideRatings_BookingID ON RideRatings(BookingID);
CREATE INDEX IX_DriverEarnings_DriverID ON DriverEarnings(DriverID);
CREATE INDEX IX_PromoCodes_Code ON PromoCodes(Code);

-- Create Views
CREATE VIEW ActiveDrivers AS
SELECT 
    dp.DriverProfileID,
    ua.FirstName + ' ' + ua.LastName AS DriverName,
    dp.VehicleMake + ' ' + dp.VehicleModel AS Vehicle,
    dp.VehicleRegistrationNumber,
    dp.AverageRating,
    dp.TotalTrips,
    rt.CurrentLatitude,
    rt.CurrentLongitude,
    rt.CurrentSpeed,
    rt.EstimatedArrivalTime
FROM DriverProfiles dp
JOIN UserAccounts ua ON dp.AccountID = ua.AccountID
JOIN RideTracking rt ON dp.DriverProfileID = rt.DriverID
WHERE ua.AccountStatus = 'Active'
AND dp.VerificationStatus = 'Verified';

GO

CREATE VIEW RideHistory AS
SELECT 
    rb.BookingID,
    ua_rider.FirstName + ' ' + ua_rider.LastName AS RiderName,
    ua_driver.FirstName + ' ' + ua_driver.LastName AS DriverName,
    a_pickup.StreetAddress AS PickupAddress,
    a_dropoff.StreetAddress AS DropoffAddress,
    rb.BookingStatus,
    rb.RequestedPickupTime,
    rb.ActualPickupTime,
    rb.ActualDropoffTime,
    rb.TotalFare,
    rb.PaymentStatus,
    rr.Rating,
    rr.Comments
FROM RideBookings rb
JOIN UserAccounts ua_rider ON rb.RiderID = ua_rider.AccountID
JOIN DriverProfiles dp ON rb.DriverID = dp.DriverProfileID
JOIN UserAccounts ua_driver ON dp.AccountID = ua_driver.AccountID
JOIN Addresses a_pickup ON rb.PickupAddressID = a_pickup.AddressID
JOIN Addresses a_dropoff ON rb.DropoffAddressID = a_dropoff.AddressID
LEFT JOIN RideRatings rr ON rb.BookingID = rr.BookingID;

GO

-- Create Stored Procedures
CREATE PROCEDURE GetDriverEarningsReport
    @DriverID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        COUNT(*) AS TotalRides,
        SUM(NetEarning) AS TotalEarnings,
        AVG(NetEarning) AS AverageEarningPerRide,
        SUM(Tips) AS TotalTips,
        SUM(SurgeBonus) AS TotalSurgeBonus,
        SUM(PlatformFee) AS TotalPlatformFees
    FROM DriverEarnings
    WHERE DriverID = @DriverID
    AND CreatedAt BETWEEN @StartDate AND @EndDate;
END;

GO

CREATE PROCEDURE GetRiderRideHistory
    @RiderID INT
AS
BEGIN
    SELECT 
        rb.BookingID,
        rb.RequestedPickupTime,
        rb.BookingStatus,
        rb.TotalFare,
        rb.PaymentStatus,
        ua_driver.FirstName + ' ' + ua_driver.LastName AS DriverName,
        dp.VehicleMake + ' ' + dp.VehicleModel AS Vehicle,
        a_pickup.StreetAddress AS PickupAddress,
        a_dropoff.StreetAddress AS DropoffAddress,
        rr.Rating,
        rr.Comments
    FROM RideBookings rb
    JOIN DriverProfiles dp ON rb.DriverID = dp.DriverProfileID
    JOIN UserAccounts ua_driver ON dp.AccountID = ua_driver.AccountID
    JOIN Addresses a_pickup ON rb.PickupAddressID = a_pickup.AddressID
    JOIN Addresses a_dropoff ON rb.DropoffAddressID = a_dropoff.AddressID
    LEFT JOIN RideRatings rr ON rb.BookingID = rr.BookingID
    WHERE rb.RiderID = @RiderID
    ORDER BY rb.RequestedPickupTime DESC;
END;

GO

-- Insert Sample Data
INSERT INTO UserAccounts (Username, Email, PasswordHash, FirstName, LastName, PhoneNumber, DateOfBirth, AccountType)
VALUES 
('john.doe', 'john.doe@example.com', 'hashed_password_1', 'John', 'Doe', '1234567890', '1990-01-01', 'Rider'),
('jane.smith', 'jane.smith@example.com', 'hashed_password_2', 'Jane', 'Smith', '0987654321', '1985-05-15', 'Driver');

GO 