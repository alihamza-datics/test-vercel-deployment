import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  // In production, create a new PrismaClient instance for each request to avoid issues with connection pooling.
  prisma = new PrismaClient({
    log: ['error', 'warn'] // Log errors and warnings for better visibility
  })
} else {
  // In development, use global object to avoid creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error'] // ['query', 'info', 'warn', 'error']
    })
  }
  prisma = global.prisma
}

// Function to test the connection
const testConnection = async () => {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`
    console.log('System Database connection is successful.')
  } catch (error) {
    console.error('Error connecting to the system database:', error)
  }
}

// Call the function to test connection
testConnection()

export default prisma
