'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function B2CLandingPage() {
  const router = useRouter()
  return (
    <div className='relative min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 px-4'>
      {/* Floating Stat Cards */}
      <div className='absolute left-8 top-32 hidden md:block'>
        <Image
          src='/left-img.png'
          alt='left-image'
          width={264.85}
          height={153.11}
        />
      </div>
      <div className='absolute right-8 top-40 hidden md:block'>
        <Image
          src='/right-img.png'
          alt='left-image'
          width={193.16}
          height={226.7}
        />
      </div>
      {/* Header */}
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
      <main className='flex flex-col items-center w-full max-w-2xl mt-20'>
        <h1 className='text-4xl md:text-5xl font-bold text-center mb-4'>
          Make People Decisions with{' '}
          <span className='text-blue-500'>Confidence</span>
        </h1>
        <p className='text-gray-500 text-center mt-5 mb-8 max-w-xl'>
          Get transparent, AI-synthesized reports from public data —<br />
          no guessing, no stalking, just signal.
        </p>
        {/* Search Box */}

        <div
          className='w-full bg-white rounded-3xl shadow border border-gray-200 relative mb-6'
          style={{ minHeight: 180 }}
        >
          {/* Large input field */}
          <input
            type='text'
            placeholder='Search by Name, Email, Social'
            className='absolute top-8 left-8 right-8 text-2xl md:text-3xl text-gray-700 font-semibold bg-transparent outline-none border-none w-auto pr-8'
            style={{ background: 'transparent' }}
          />

          <div
            className='absolute bottom-6 left-8 px-6 py-2'
            style={{
              display: 'inline-block',
              borderRadius: '10px',
              padding: '2px',
              background:
                'linear-gradient(90deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)',
            }}
          >
            <button
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: '500',
                background: 'white',
                color: '#4B5563',
              }}
            >
              Observr ai
            </button>
          </div>
          {/* Search button */}
          <button
            className='absolute bottom-6 right-8 px-8 py-2 rounded-full font-semibold text-white text-xl flex items-center gap-2 shadow-lg'
            style={{
              background: 'linear-gradient(180deg, #5A73FF 0%, #5BC0EB 100%)',
            }}
            onClick={() => router.push('/locationPage')}
          >
            <Image src='/stars.svg' alt='star-image' width={24} height={24} />
            Search
          </button>
        </div>

        <button
          className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg px-8 py-3 mb-8 shadow mt-4'
          style={{
            background: 'linear-gradient(360deg, #1C3AE3 0%, #5870F7 100%)',
          }}
        >
          Upgrade To Pro
        </button>
        {/* Testimonial */}
        <div className='flex items-center gap-2 text-gray-600 text-sm'>
          <Image src='/starFrame.png' alt='rating' width={86} height={16} />
          <span>Received the most valuable voting by Kota</span>
        </div>
      </main>
    </div>
  )
}
