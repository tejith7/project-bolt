-- Create Database
CREATE DATABASE RideShareDB;
GO

USE RideShareDB;
GO

-- Users Table
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    UserType NVARCHAR(10) NOT NULL CHECK (UserType IN ('rider', 'driver')),
    ProfilePicture NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- Driver Details Table
CREATE TABLE DriverDetails (
    DriverID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    LicenseNumber NVARCHAR(50) NOT NULL UNIQUE,
    VehicleType NVARCHAR(50) NOT NULL,
    VehicleModel NVARCHAR(100) NOT NULL,
    VehicleNumber NVARCHAR(20) NOT NULL,
    VehicleColor NVARCHAR(50) NOT NULL,
    IsVerified BIT DEFAULT 0,
    Rating DECIMAL(3,2) DEFAULT 0,
    TotalRides INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Locations Table
CREATE TABLE Locations (
    LocationID INT IDENTITY(1,1) PRIMARY KEY,
    Address NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(20) NOT NULL,
    Latitude DECIMAL(10,8) NOT NULL,
    Longitude DECIMAL(11,8) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Rides Table
CREATE TABLE Rides (
    RideID INT IDENTITY(1,1) PRIMARY KEY,
    RiderID INT FOREIGN KEY REFERENCES Users(UserID),
    DriverID INT FOREIGN KEY REFERENCES DriverDetails(DriverID),
    PickupLocationID INT FOREIGN KEY REFERENCES Locations(LocationID),
    DropoffLocationID INT FOREIGN KEY REFERENCES Locations(LocationID),
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    RequestTime DATETIME DEFAULT GETDATE(),
    PickupTime DATETIME,
    DropoffTime DATETIME,
    EstimatedFare DECIMAL(10,2) NOT NULL,
    ActualFare DECIMAL(10,2),
    PaymentStatus NVARCHAR(20) DEFAULT 'pending' CHECK (PaymentStatus IN ('pending', 'completed', 'failed')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Ride Tracking Table
CREATE TABLE RideTracking (
    TrackingID INT IDENTITY(1,1) PRIMARY KEY,
    RideID INT FOREIGN KEY REFERENCES Rides(RideID),
    DriverLocationID INT FOREIGN KEY REFERENCES Locations(LocationID),
    TrackingTime DATETIME DEFAULT GETDATE(),
    EstimatedArrivalTime DATETIME,
    DistanceRemaining DECIMAL(10,2),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Payments Table
CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    RideID INT FOREIGN KEY REFERENCES Rides(RideID),
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL,
    TransactionID NVARCHAR(100),
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('pending', 'completed', 'failed', 'refunded')),
    PaymentTime DATETIME DEFAULT GETDATE(),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Reviews Table
CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    RideID INT FOREIGN KEY REFERENCES Rides(RideID),
    ReviewerID INT FOREIGN KEY REFERENCES Users(UserID),
    RevieweeID INT FOREIGN KEY REFERENCES Users(UserID),
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Driver Availability Table
CREATE TABLE DriverAvailability (
    AvailabilityID INT IDENTITY(1,1) PRIMARY KEY,
    DriverID INT FOREIGN KEY REFERENCES DriverDetails(DriverID),
    IsAvailable BIT DEFAULT 1,
    CurrentLocationID INT FOREIGN KEY REFERENCES Locations(LocationID),
    LastUpdated DATETIME DEFAULT GETDATE()
);

-- Ride Requests Table
CREATE TABLE RideRequests (
    RequestID INT IDENTITY(1,1) PRIMARY KEY,
    RiderID INT FOREIGN KEY REFERENCES Users(UserID),
    PickupLocationID INT FOREIGN KEY REFERENCES Locations(LocationID),
    DropoffLocationID INT FOREIGN KEY REFERENCES Locations(LocationID),
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('pending', 'accepted', 'rejected', 'expired')),
    RequestTime DATETIME DEFAULT GETDATE(),
    ExpiryTime DATETIME NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Create Indexes
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_UserType ON Users(UserType);
CREATE INDEX IX_DriverDetails_UserID ON DriverDetails(UserID);
CREATE INDEX IX_Rides_RiderID ON Rides(RiderID);
CREATE INDEX IX_Rides_DriverID ON Rides(DriverID);
CREATE INDEX IX_Rides_Status ON Rides(Status);
CREATE INDEX IX_RideTracking_RideID ON RideTracking(RideID);
CREATE INDEX IX_Payments_RideID ON Payments(RideID);
CREATE INDEX IX_Reviews_RideID ON Reviews(RideID);
CREATE INDEX IX_DriverAvailability_DriverID ON DriverAvailability(DriverID);
CREATE INDEX IX_RideRequests_RiderID ON RideRequests(RiderID);

-- Add some sample data (optional)
INSERT INTO Users (Name, Email, PasswordHash, PhoneNumber, UserType)
VALUES 
('John Doe', 'john@example.com', 'hashed_password_1', '1234567890', 'rider'),
('Jane Smith', 'jane@example.com', 'hashed_password_2', '0987654321', 'driver');

-- Note: In a real application, you would never store plain text passwords.
-- The PasswordHash column should contain a securely hashed (and salted) version of the user's password.

GO

-- Create a view for active rides
CREATE VIEW ActiveRides AS
SELECT 
    r.RideID,
    u_rider.Name AS RiderName,
    u_driver.Name AS DriverName,
    l_pickup.Address AS PickupAddress,
    l_dropoff.Address AS DropoffAddress,
    r.Status,
    r.RequestTime,
    r.EstimatedFare
FROM Rides r
JOIN Users u_rider ON r.RiderID = u_rider.UserID
JOIN DriverDetails dd ON r.DriverID = dd.DriverID
JOIN Users u_driver ON dd.UserID = u_driver.UserID
JOIN Locations l_pickup ON r.PickupLocationID = l_pickup.LocationID
JOIN Locations l_dropoff ON r.DropoffLocationID = l_dropoff.LocationID
WHERE r.Status IN ('pending', 'accepted', 'in_progress');

GO

-- Create a stored procedure to get ride history for a user
CREATE PROCEDURE GetUserRideHistory
    @UserID INT,
    @UserType NVARCHAR(10)
AS
BEGIN
    IF @UserType = 'rider'
    BEGIN
        SELECT 
            r.RideID,
            r.RequestTime,
            r.Status,
            r.EstimatedFare,
            r.ActualFare,
            u_driver.Name AS DriverName,
            l_pickup.Address AS PickupAddress,
            l_dropoff.Address AS DropoffAddress
        FROM Rides r
        JOIN DriverDetails dd ON r.DriverID = dd.DriverID
        JOIN Users u_driver ON dd.UserID = u_driver.UserID
        JOIN Locations l_pickup ON r.PickupLocationID = l_pickup.LocationID
        JOIN Locations l_dropoff ON r.DropoffLocationID = l_dropoff.LocationID
        WHERE r.RiderID = @UserID
        ORDER BY r.RequestTime DESC;
    END
    ELSE IF @UserType = 'driver'
    BEGIN
        SELECT 
            r.RideID,
            r.RequestTime,
            r.Status,
            r.EstimatedFare,
            r.ActualFare,
            u_rider.Name AS RiderName,
            l_pickup.Address AS PickupAddress,
            l_dropoff.Address AS DropoffAddress
        FROM Rides r
        JOIN Users u_rider ON r.RiderID = u_rider.UserID
        JOIN Locations l_pickup ON r.PickupLocationID = l_pickup.LocationID
        JOIN Locations l_dropoff ON r.DropoffLocationID = l_dropoff.LocationID
        JOIN DriverDetails dd ON r.DriverID = dd.DriverID
        WHERE dd.UserID = @UserID
        ORDER BY r.RequestTime DESC;
    END
END;

GO

-- Create a stored procedure to calculate driver earnings
CREATE PROCEDURE CalculateDriverEarnings
    @DriverID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        COUNT(*) AS TotalRides,
        SUM(ActualFare) AS TotalEarnings,
        AVG(ActualFare) AS AverageFare,
        MIN(ActualFare) AS MinimumFare,
        MAX(ActualFare) AS MaximumFare
    FROM Rides r
    JOIN DriverDetails dd ON r.DriverID = dd.DriverID
    WHERE dd.UserID = @DriverID
    AND r.Status = 'completed'
    AND r.DropoffTime BETWEEN @StartDate AND @EndDate;
END;

GO 