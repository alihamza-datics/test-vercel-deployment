// importData.ts

// import { closeDBConnection, getDBConnection } from '@/lib/db/mssqlDb'
// import { PrismaClient } from '@prisma/client'
// const { PrismaClient } = require('@prisma/client')
// const { closeDBConnection, getDBConnection } = require('../lib/db/mssqlDb')
const sql = require('mssql')

const config = {
  user: 'Markival-ai',
  password: 'M@rk!w4l@74',
  server: 'markival-ai.database.windows.net',
  database: 'kor-sql-sand-01',
  options: {
    encrypt: true, // Use this if you're connecting to Azure SQL
    trustServerCertificate: true // Change to 'true' for local dev / self-signed certs
  }
}

// const prisma = new PrismaClient()

async function migrateData() {
  let pool = null

  try {
    // Get the database connection
    pool = await sql.connect(config)

    // Fetch data from external MSSQL database
    const companiesResult = await pool
      .request()
      .query('SELECT TOP 1 * FROM suiteql.viewCustomerPoC')
    // const [productsResult] = await pool
    //   .request()
    //   .query('SELECT TOP 100 * FROM suiteql.viewItemPoC')
    // const [competitorsResult] = await pool
    //   .request()
    //   .query('SELECT TOP 100 * FROM suiteql.viewInvoicePoC')
    // Insert data into Prisma-managed database
    console.log('here ', companiesResult)
    // await prisma.companies.createMany({
    //   data: companiesResult.map(c => ({
    //     name: c.name,
    //     summary: c.summary,
    //     customerRetentionRate: c.customerRetentionRate,
    //     positiveSentiment: c.positiveSentiment,
    //     negativeSentiment: c.negativeSentiment,
    //     netSentiment: c.netSentiment
    //   }))
    // })

    // await prisma.products.createMany({
    //   data: productsResult.map(p => ({
    //     name: p.name,
    //     image: p.image,
    //     description: p.description,
    //     companyId: p.companyId,
    //     rating: p.rating,
    //     earning: p.earning,
    //     category: p.category
    //   }))
    // })

    // await prisma.competitors.createMany({
    //   data: competitorsResult.map(c => ({
    //     name: c.name,
    //     link: c.link
    //   }))
    // })

    console.log('Data populated successfully!')
  } catch (error) {
    console.error('Error populating data:', error)
  } finally {
    // Close the external database connection
    if (pool) {
      await pool.close()
    }
    // Disconnect Prisma client
    // await prisma.$disconnect()
  }
}

migrateData()
