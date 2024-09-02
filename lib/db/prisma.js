import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  // In production, create a new PrismaClient instance for each request
  prisma = new PrismaClient({
    log: ['error', 'warn'] // Log errors and warnings
  })
} else {
  // In development, use global object to avoid creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error'] // Log errors
    })
  }
  prisma = global.prisma
}

// Function to test the connection
const testConnection = async () => {
  try {
    // Perform a simple query to test the connection
    await prisma.$queryRaw`SELECT 1`
    console.log('System Database connection is successful.')
  } catch (error) {
    console.error('Error connecting to the system database:', error)
  }
}

// Call the function to test the connection
testConnection()
  .then(() => {
    // Optionally handle any post-connection logic here
  })
  .catch(error => {
    // Optionally handle errors here if necessary
    console.error('Error occurred during connection test:', error)
  })

export default prisma
