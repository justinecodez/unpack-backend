import { Server, Socket } from 'socket.io'

type UserType = 'user' | 'driver'

// Mock function to get user type
function getUserType(userId: string): UserType {
  // Implement logic to determine if a user is a 'user' or 'driver'
  // based on the userId in the location data coming from the client
  return 'user' // or 'driver'
}

export class SocketService {
  private io: Server

  constructor(server: any) {
    this.io = new Server(server)

    this.initializeSocketEvents()
  }

  private initializeSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`New connection: ${socket.id}`)

      // Listen to location updates and handle based on user type
      socket.on('updateLocation', (locationData: LocationData) => {
        console.log(
          `Location update from ${locationData.userId}:`,
          locationData
        )
        const userType = getUserType(locationData.userId)
        if (userType === 'driver') {
          this.handleDriverLocationUpdate(locationData)
        } else if (userType === 'user') {
          this.handleUserLocationUpdate(locationData)
        }
      })

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
      })
    })
  }

  private handleDriverLocationUpdate(locationData: LocationData): void {
    // Save driver location data to the database
    saveLocationToDatabase(locationData)
    // Broadcast to users tracking drivers
    this.io.emit('driverLocationUpdate', locationData)
  }

  private handleUserLocationUpdate(locationData: LocationData): void {
    // Save user location data to the database
    saveLocationToDatabase(locationData)
    // Handle user-specific location logic
    // Example: Emit to specific driver or to a group of drivers
    // this.io.to(someDriverId).emit('userLocationUpdate', locationData);
  }
}

// Mock database saving function
function saveLocationToDatabase(locationData: LocationData) {
  console.log('Saving location to database:', locationData)
  // Implement the actual database saving logic here
}

/**

How to send location For a Driver: Assuming this code is running on the driver's app

1. Get the driver's current location
2. Save the location to the database
3. Broadcast the location update to all other drivers
function sendLocationUpdate(latitude, longitude) {
  const locationData = { latitude, longitude };
  socket.emit('driverLocationUpdate', locationData);
}
4. After the delivery is over delete the location history from database and save the starting point to destination only


How to send location For a User: Assuming this code is running on the user's app
function sendLocationUpdate(latitude, longitude) {
  const locationData = { latitude, longitude };
  socket.emit('userLocationUpdate', locationData);
}

 */