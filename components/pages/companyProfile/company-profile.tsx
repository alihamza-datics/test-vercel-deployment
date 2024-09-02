'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card'
import Link from 'next/link'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { PiChartLayout } from '../../../components/piChart/pi-chart'
import SentimentsGraph from '@/components/sampleChart/sample-chart'
import { useUser } from '@clerk/nextjs'

function ClipboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      className="text-purple-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      className="text-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const CompanyProfilePage = () => {
  const users = {
    profileImage: '/images/profile-picture.png',
    backgroundImage: '/images/profile-Background.png'
  }

  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <header
          className="relative h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${users.backgroundImage})` }}
        >
          <div className="absolute inset-0 opacity-25"></div>
        </header>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <div className="relative -top-16 px-10 block xl:flex xl:items-center xl:justify-start text-black">
            <img
              src="/images/Korin-logo.png"
              alt="Profile"
              className="p-3 size-32 rounded object-contain border bg-white border-[#BFBCC0]"
            />
            <div className="ml-0 mb-[20px] mt-[20px] xl:ml-4 xl:mt-0 xl:mb-0 p-[12px] rounded border border-[#BFBCC0] bg-white min-h-[17.5vh] overflow-auto ">
              <h6 className="font-bold text-[20px]">Korin Inc.</h6>
              <p className="m-0 p-0">
                Since 1982, this Tribeca showroom has been a cornerstone of New
                York's culinary scene, offering the world’s largest collection
                of Japanese knives, premium kitchen tools, and exquisite
                tableware. Blending innovative design with traditional
                craftsmanship, it provides unmatched quality to chefs and home
                cooks alike. The showroom also deepens its community ties by
                hosting knife sharpening demonstrations and events with renowned
                chefs.
              </p>
            </div>
          </div>
        </div>

        <main className="px-6 pt-0 sm:p-6 -mt-[90px]">
          <div className="p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card className="col-span-2 lg:col-span-1 bg-[#F5F6FE]">
                <div className="flex items-center space-x-2 p-5">
                  <div className="flex items-center justify-center bg-[#309F34] text-white rounded-full p-2">
                    <ClipboardIcon className="text-white size-6" />{' '}
                  </div>
                  <div>Daily Summary</div>
                </div>
                <CardContent>
                  <p>
                    The data reveals significant gaps and inconsistencies across
                    various fields, which could impact both product management
                    and customer relationship management (CRM) processes. With
                    32,251 unique products, the absence of alternative
                    identification methods, incomplete dimensional data, and
                    inconsistent descriptions could hinder inventory management,
                    e-commerce, and logistics. The lack of category
                    classification, pricing information, and product imagery
                    further complicates market segmentation and sales
                    strategies. Additionally, the dataset contains 1,000
                    customer records, but missing key information like Company
                    Name, Email, and Phone Numbers limits the effectiveness of
                    targeted marketing and customer engagement. Despite these
                    challenges, the dataset is actively maintained, with unique
                    identifiers like Customer ID and NetsuiteLink ensuring some
                    level of operational efficiency. However, the presence of
                    negative transaction amounts and other data quality issues
                    indicates a need for improved data collection and management
                    practices to enhance overall effectiveness in both product
                    and customer-related operations.
                  </p>
                </CardContent>
              </Card>
              <Card className="col-span-2 lg:col-span-1 bg-[#F5F6FE]">
                <div className="flex items-center space-x-2 p-5">
                  <div className="flex items-center justify-center bg-[#8900A0] text-white rounded-full p-2">
                    <ClipboardIcon className="text-white size-6" />{' '}
                  </div>
                  <div>Key Takeaways</div>
                </div>
                <Card className="col-span-2 lg:col-span-1 m-5 mt-0">
                  <div className="flex items-left space-x-2 p-5">
                    <div>
                      <LightbulbIcon />{' '}
                    </div>
                    <div>
                      The sales data shows inconsistencies like missing customer
                      information and negative transaction amounts, suggesting
                      potential data quality issues and the need for review.
                      Despite this, all transactions are successfully closed,
                      indicating effective sales processing.
                    </div>
                  </div>
                </Card>
                <Card className="col-span-2 lg:col-span-1 m-5">
                  <div className="flex items-left space-x-2 p-5">
                    <div>
                      <LightbulbIcon />{' '}
                    </div>
                    <div>
                      Customers data incomplete contact information and B2C
                      focus highlight the need for improved data quality and
                      tailored marketing strategies for better customer
                      engagement and operational efficiency.
                    </div>
                  </div>
                </Card>
                <Card className="col-span-2 lg:col-span-1 m-5">
                  <div className="flex items-left space-x-2 p-5">
                    <div>
                      <LightbulbIcon />{' '}
                    </div>
                    <div>
                      Product's data contains lack of alternative identifiers,
                      consistent category information, pricing, imagery,
                      manufacturer details, and dimensional data hampers
                      effective product tracking, segmentation, and supply chain
                      management.
                    </div>
                  </div>
                </Card>
              </Card>
            </div>
            {/* <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full mt-4 md:mt-0">
                    <PiChartLayout />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sentiments Graph</CardTitle>
                </CardHeader>
                <CardContent>
                  <SentimentsGraph />
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-between items-center">
              <CardTitle>Products Portfolio</CardTitle>
              <Link href="#" className="text-sm text-blue-500" prefetch={false}>
                View all
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Card>
                <CardContent className='pt-6'>
                  <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-full h-auto"
                    width="150"
                    height="150"
                    style={{ aspectRatio: '150/150', objectFit: 'cover' }}
                  />
                  <p>Thinking Components</p>
                </CardContent>
              </Card>
              <Card>
              <CardContent className='pt-6'>
              <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-full h-auto"
                    width="150"
                    height="150"
                    style={{ aspectRatio: '150/150', objectFit: 'cover' }}
                  />
                  <p>Functional Fury</p>
                </CardContent>
              </Card>
              <Card>
              <CardContent className='pt-6'>
              <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-full h-auto"
                    width="150"
                    height="150"
                    style={{ aspectRatio: '150/150', objectFit: 'cover' }}
                  />
                  <p>React Renaissance</p>
                </CardContent>
              </Card>
              <Card>
              <CardContent className='pt-6'>
              <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-full h-auto"
                    width="150"
                    height="150"
                    style={{ aspectRatio: '150/150', objectFit: 'cover' }}
                  />
                  <p>Scala Symphony</p>
                </CardContent>
              </Card>
              <Card>
              <CardContent className='pt-6'>
              <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-full h-auto"
                    width="150"
                    height="150"
                    style={{ aspectRatio: '150/150', objectFit: 'cover' }}
                  />
                  <p>Angular Awesomeness</p>
                </CardContent>
              </Card>
              <Card>
              <CardContent className='pt-6'>
              <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="w-full h-auto"
                    width="150"
                    height="150"
                    style={{ aspectRatio: '150/150', objectFit: 'cover' }}
                  />
                  <p>The Art of Usability</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 overflow-scroll">
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Products</CardTitle>
                  <CardDescription>
                    Yoursite 25k+ more from these products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Rating</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Product 1</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <StarIcon />
                            <span>4.5</span>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Product 2</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <StarIcon />
                            <span>4.8</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Competitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Company Name</TableCell>
                        <TableCell>Link</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Company 1</TableCell>
                        <TableCell>
                          <Link
                            href="#"
                            className="text-blue-500"
                            prefetch={false}
                          >
                            View details
                          </Link>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Company 2</TableCell>
                        <TableCell>
                          <Link
                            href="#"
                            className="text-blue-500"
                            prefetch={false}
                          >
                            View details
                          </Link>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Company 3</TableCell>
                        <TableCell>
                          <Link
                            href="#"
                            className="text-blue-500"
                            prefetch={false}
                          >
                            View details
                          </Link>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Company 4</TableCell>
                        <TableCell>
                          <Link
                            href="#"
                            className="text-blue-500"
                            prefetch={false}
                          >
                            View details
                          </Link>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CompanyProfilePage
