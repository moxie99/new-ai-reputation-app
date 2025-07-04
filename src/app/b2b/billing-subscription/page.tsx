'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import Image from 'next/image'

export default function BillingDashboard() {
  return (
    <div className='flex min-h-screen'>
      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        {/* Header */}
        <header className='bg-white border-gray-200 px-4 md:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              Billing & Subscription
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className='p-4 md:p-8'>
          {/* Mobile Layout - Stacked Cards */}
          <div className='block lg:hidden space-y-6'>
            {/* Plans Header */}
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <h2 className='text-lg font-semibold text-gray-900 tracking-wide'>
                PLANS
              </h2>
            </div>

            {/* Growth Plan Card */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex flex-col items-center text-center'>
                <Image
                  src='/growth.png'
                  alt='growth image'
                  height={40}
                  width={40}
                />
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2 mt-4'>
                  Growth
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  For Small Businesses
                </p>
                <div className='mb-6'>
                  <span className='text-3xl md:text-4xl font-bold text-gray-900'>
                    $499
                  </span>
                  <span className='text-gray-600 ml-1'>/ month</span>
                </div>
                <Button className='w-full bg-[#2693F1] hover:bg-blue-700 text-white rounded-full mb-6'>
                  Change Plan
                </Button>

                {/* Features */}
                <div className='w-full space-y-3 text-left border-t pt-4'>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>
                      Reports / Month
                    </span>
                    <span className='text-gray-700'>100</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Users</span>
                    <span className='text-gray-700'>2</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>
                      CSV Upload
                    </span>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Export</span>
                    <span className='text-gray-700'>PDF</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Support</span>
                    <span className='text-gray-700'>Email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scale Plan Card */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex flex-col items-center text-center'>
                <Image
                  src='/scale.png'
                  alt='scale image'
                  height={40}
                  width={40}
                />
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2 mt-4'>
                  Scale
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  For Medium Businesses
                </p>
                <div className='mb-4'>
                  <span className='text-3xl md:text-4xl font-bold text-gray-900'>
                    $899
                  </span>
                  <span className='text-gray-600 ml-1'>/ month</span>
                </div>
                <Badge
                  variant='secondary'
                  className='mb-6 bg-blue-50 text-blue-700 px-4 py-1'
                >
                  Current plan
                </Badge>

                {/* Features */}
                <div className='w-full space-y-3 text-left border-t pt-4'>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>
                      Reports / Month
                    </span>
                    <span className='text-gray-700'>300</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Users</span>
                    <span className='text-gray-700'>5</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>
                      CSV Upload
                    </span>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Export</span>
                    <span className='text-gray-700'>PDF, CSV</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Support</span>
                    <span className='text-gray-700'>Priority</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Plan Card */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex flex-col items-center text-center'>
                <Image
                  src='/enterprise.png'
                  alt='enterprise image'
                  height={40}
                  width={40}
                />
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2 mt-4'>
                  Enterprise
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  For Large Enterprises
                </p>
                <div className='mb-6'>
                  <span className='text-3xl md:text-4xl font-bold text-gray-900'>
                    Custom
                  </span>
                </div>
                <Button className='w-full bg-[#2693F1] hover:bg-blue-700 text-white rounded-full mb-6'>
                  Change Plan
                </Button>

                {/* Features */}
                <div className='w-full space-y-3 text-left border-t pt-4'>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>
                      Reports / Month
                    </span>
                    <span className='text-gray-700'>Unlimited</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Users</span>
                    <span className='text-gray-700'>Unlimited</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>
                      CSV Upload
                    </span>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Export</span>
                    <span className='text-gray-700'>All</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-900'>Support</span>
                    <span className='text-gray-700'>Dedicated CSM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Layout - Table Format */}
          <div className='hidden lg:block'>
            <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
              {/* Top Row - 4 cells */}
              <div className='grid grid-cols-4'>
                {/* Cell 1: PLANS */}
                <div className='border-r border-gray-200 p-6 bg-gray-50 flex items-start'>
                  <h2 className='text-lg font-semibold text-gray-900 tracking-wide'>
                    PLANS
                  </h2>
                </div>

                {/* Cell 2: Growth Plan */}
                <div className='border-r border-gray-200 px-6 xl:px-14 flex flex-col items-center text-center mt-4'>
                  <Image
                    src='/growth.png'
                    alt='growth image'
                    height={40}
                    width={40}
                  />
                  <h3 className='text-xl xl:text-2xl font-bold text-gray-900 mb-2 mt-4'>
                    Growth
                  </h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    For Small Businesses
                  </p>
                  <div className='mb-6'>
                    <span className='text-2xl xl:text-4xl font-bold text-gray-900'>
                      $499
                    </span>
                    <span className='text-gray-600 ml-1 text-sm xl:text-base'>
                      / month
                    </span>
                  </div>
                  <Button className='w-full bg-[#2693F1] hover:bg-blue-700 text-white rounded-full text-sm xl:text-base px-4'>
                    Change Plan
                  </Button>
                </div>

                {/* Cell 3: Scale Plan */}
                <div className='border-r border-gray-200 px-6 xl:px-14 flex flex-col items-center text-center mt-4'>
                  <Image
                    src='/scale.png'
                    alt='scale image'
                    height={40}
                    width={40}
                  />
                  <h3 className='text-xl xl:text-2xl font-bold text-gray-900 mb-2 mt-4'>
                    Scale
                  </h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    For Medium Businesses
                  </p>
                  <div className='mb-4'>
                    <span className='text-2xl xl:text-4xl font-bold text-gray-900'>
                      $899
                    </span>
                    <span className='text-gray-600 ml-1 text-sm xl:text-base'>
                      / month
                    </span>
                  </div>
                  <Badge
                    variant='secondary'
                    className='mb-4 bg-blue-50 text-blue-700 px-4 py-1'
                  >
                    Current plan
                  </Badge>
                </div>

                {/* Cell 4: Enterprise Plan */}
                <div className='px-6 xl:px-14 flex flex-col items-center text-center mt-4 mb-4'>
                  <Image
                    src='/enterprise.png'
                    alt='enterprise image'
                    height={40}
                    width={40}
                  />
                  <h3 className='text-xl xl:text-2xl font-bold text-gray-900 mb-2 mt-4'>
                    Enterprise
                  </h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    For Large Enterprises
                  </p>
                  <div className='mb-4'>
                    <span className='text-2xl xl:text-4xl font-bold text-gray-900'>
                      Custom
                    </span>
                  </div>
                  <Button className='w-full bg-[#2693F1] hover:bg-blue-700 text-white rounded-full text-sm xl:text-base px-4'>
                    Change Plan
                  </Button>
                </div>
              </div>

              {/* Bottom Row - 4 cells with feature details */}
              <div className='grid grid-cols-4 border-t border-gray-200'>
                {/* Cell 5: Feature Labels */}
                <div className='border-r border-gray-200 p-6 bg-gray-50 space-y-6'>
                  <div className='font-medium text-gray-900 text-sm xl:text-base'>
                    Reports / Month
                  </div>
                  <div className='font-medium text-gray-900 text-sm xl:text-base'>
                    Users
                  </div>
                  <div className='font-medium text-gray-900 text-sm xl:text-base'>
                    CSV Upload
                  </div>
                  <div className='font-medium text-gray-900 text-sm xl:text-base'>
                    Export
                  </div>
                  <div className='font-medium text-gray-900 text-sm xl:text-base'>
                    Support
                  </div>
                </div>

                {/* Cell 6: Growth Features */}
                <div className='border-r border-gray-200 p-6 space-y-6 text-center'>
                  <div className='text-gray-700 text-sm xl:text-base'>100</div>
                  <div className='text-gray-700 text-sm xl:text-base'>2</div>
                  <div className='flex justify-center'>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='text-gray-700 text-sm xl:text-base'>PDF</div>
                  <div className='text-gray-700 text-sm xl:text-base'>
                    Email
                  </div>
                </div>

                {/* Cell 7: Scale Features */}
                <div className='border-r border-gray-200 p-6 space-y-6 text-center'>
                  <div className='text-gray-700 text-sm xl:text-base'>300</div>
                  <div className='text-gray-700 text-sm xl:text-base'>5</div>
                  <div className='flex justify-center'>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='text-gray-700 text-sm xl:text-base'>
                    PDF, CSV
                  </div>
                  <div className='text-gray-700 text-sm xl:text-base'>
                    Priority
                  </div>
                </div>

                {/* Cell 8: Enterprise Features */}
                <div className='p-6 space-y-6 text-center'>
                  <div className='text-gray-700 text-sm xl:text-base'>
                    Unlimited
                  </div>
                  <div className='text-gray-700 text-sm xl:text-base'>
                    Unlimited
                  </div>
                  <div className='flex justify-center'>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='text-gray-700 text-sm xl:text-base'>All</div>
                  <div className='text-gray-700 text-sm xl:text-base'>
                    Dedicated CSM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
