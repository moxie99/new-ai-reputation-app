/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function LocationFilterPage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const cities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
  ]

  const handleSubmit = () => {
    console.log('Submitting with city:', selectedCity)
    // Navigate to next step or results
  }

  const handleDontKnow = () => {
    console.log("User doesn't know location")
    // Continue without location filter
  }

  const handleSkip = () => {
    console.log('Skipping location step')
    // Skip this step entirely
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation Header - Same as landing page */}

      <header className='w-full max-w-4xl flex items-center justify-between bg-white rounded-2xl shadow px-6 py-3 mb-12 mt-2'>
        <div className='flex items-center gap-2'>
          {/* Placeholder logo */}
          {/* <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>O</span>
          </div> */}
          <Image src='/logo.png' alt='logo' width={32.25} height={25} />
          <span className='font-bold text-lg text-gray-800'>Observr</span>
        </div>
        <nav className='flex gap-8 text-gray-600 font-medium'>
          <Link href='#'>Home</Link>
          <Link href='#'>Saved</Link>
          <Link href='#'>Pricing</Link>
        </nav>
        {/* Placeholder avatar */}
        <div className='w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center'>
          <span className='text-gray-400 text-xl'>👤</span>
        </div>
      </header>
      {/* Main Content */}
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-8'>
        <div className='max-w-lg mx-auto text-center'>
          {/* Main Question */}
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Do you know where they live or have lived?
          </h1>

          {/* Subtitle */}
          <p className='text-lg text-gray-600 mb-12'>
            This helps narrow down Our Results
          </p>

          {/* City Selection and Action Buttons Container */}
          <div className='rounded-2xl border border-gray-200 shadow-sm p-8 max-w-4xl mx-auto mb-8'>
            {/* Responsive flex layout - horizontal on large screens, vertical on small */}
            <div className='flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0'>
              {/* City Selection Dropdown */}
              <div className='relative flex-1'>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='w-full flex items-center justify-between px-6 py-4 bg-gray-50 border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                >
                  <div className='flex items-center space-x-3'>
                    <MapPin className='w-5 h-5 text-gray-400' />
                    <span
                      className={
                        selectedCity ? 'text-gray-900' : 'text-gray-500'
                      }
                    >
                      {selectedCity || 'Select City'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto'>
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city)
                          setIsDropdownOpen(false)
                        }}
                        className='w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0'
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons - Beside dropdown on large screens, below on small screens */}
              <div className='flex space-x-4 lg:flex-shrink-0'>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedCity}
                  className='px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium'
                >
                  Submit
                </button>
                <button
                  onClick={handleDontKnow}
                  className='px-8 py-4 border border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors font-medium'
                >
                  I don't know
                </button>
              </div>
            </div>
          </div>

          {/* Skip Button - Outside with light gray border */}
          <button
            onClick={handleSkip}
            className='px-6 py-2 border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 font-medium text-lg transition-colors rounded-lg'
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  )
}
