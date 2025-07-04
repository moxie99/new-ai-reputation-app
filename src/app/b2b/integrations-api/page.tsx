'use client'
import Image from 'next/image'
import React from 'react'

// Integration data
const connectedIntegrations = [
  {
    name: 'Facebook',
    icon: '/facebook.png',
    status: 'connected',
    statusText: '1 CONNECTED',
  },
  {
    name: 'Google AI Studio api key',
    icon: '/google.png',
    status: 'key-provided',
    statusText: 'KEY PROVIDED',
  },
  {
    name: 'Instagram',
    icon: '/ig.png',
    status: 'connected',
    statusText: '1 CONNECTED',
  },
  {
    name: 'X',
    icon: '/x.png',
    status: 'key-provided',
    statusText: 'KEY PROVIDED',
  },
]

const availableIntegrations = [
  { name: 'LinkedIn', icon: '/linkedin.png' },
  { name: 'Snapchat', icon: '/snap.png' },
  { name: 'Reddit', icon: '/reddit.png' },
  { name: 'Youtube', icon: '/youtube.png' },
  { name: 'Tinder', icon: '/tinder.png' },
  { name: 'Hinge', icon: '/hinge.png' },
]

export default function IntegrationsApiPage() {
  return (
    <div className='flex min-h-screen bg-white rounded-md'>
      {/* Main Content */}
      <div className='flex-1 p-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Integrations & API
        </h1>

        {/* Your Integrations Section */}
        <div className='mb-12 rounded-lg border pt-3 border-[#eeeeee]'>
          <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6 pl-4'>
            YOUR INTEGRATIONS
          </h2>
          <div
            className='border border-gray-200 overflow-hidden bg-white'
            style={{ borderColor: '#eeeeee' }}
          >
            {connectedIntegrations.map((integration, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== connectedIntegrations.length - 1 ? 'border-b' : ''
                }`}
                style={{ borderColor: '#eeeeee' }}
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-10 h-10 flex items-center justify-center'>
                    <Image
                      src={integration.icon}
                      alt={`${integration.name} icon`}
                      height={30}
                      width={30}
                      className='object-contain'
                    />
                  </div>
                  <span className='font-medium text-gray-900'>
                    {integration.name}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  {integration.status === 'connected' && (
                    <>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      <span className='text-sm text-gray-600 font-medium'>
                        {integration.statusText}
                      </span>
                    </>
                  )}
                  {integration.status === 'key-provided' && (
                    <span className='text-sm text-gray-600 font-medium'>
                      {integration.statusText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Integrations Section */}
        <div className='border rounded-lg border-[#eeeeee] pt-3'>
          <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6 pl-4'>
            ADD INTEGRATIONS
          </h2>
          <div
            className='border border-gray-200 overflow-hidden bg-white'
            style={{ borderColor: '#eeeeee' }}
          >
            {availableIntegrations.map((integration, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                  index !== availableIntegrations.length - 1 ? 'border-b' : ''
                }`}
                style={{ borderColor: '#eeeeee' }}
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-10 h-10 flex items-center justify-center'>
                    <Image
                      src={integration.icon}
                      alt={`${integration.name} icon`}
                      height={30}
                      width={30}
                      className='object-contain'
                    />
                  </div>
                  <span className='font-medium text-gray-900'>
                    {integration.name}
                  </span>
                </div>
                <button className='opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700'>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
