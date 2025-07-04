'use client'
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface DataDisclosureFormProps {
  onNext: () => void
  onBack: () => void
}

const DataDisclosureForm: React.FC<DataDisclosureFormProps> = ({
  onNext,
  onBack,
}) => {
  const [acknowledged, setAcknowledged] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (acknowledged) {
      onNext()
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between p-6'>
        <button
          onClick={onBack}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <ArrowLeft className='w-5 h-5 text-gray-600' />
        </button>
        <div className='flex items-center space-x-2'>
          <Image src='/logo.png' alt='logo' height={29} width={37.27} />
          <span className='font-semibold text-gray-900'>Observr</span>
        </div>
        <div className='w-9'></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className='px-6 mb-8'>
        <div className='w-full bg-gray-200 rounded-full h-1'>
          <div
            className='bg-blue-500 h-1 rounded-full transition-all duration-500 ease-out'
            style={{ width: '72%' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-start justify-center px-6 py-8'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-4'>
              How We Use and Disclose Public Data
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              We only collect publicly available data and never access private
              accounts. Learn how we use and analyze this data.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8'>
            <div className='space-y-6 text-sm text-gray-700 leading-relaxed'>
              <p>
                You are being asked to authorize Boltshift Inc. to collect and
                analyze publicly available information across platforms (e.g.,
                social media, press, forums) to generate a structured reputation
                profile...
              </p>

              <ul className='space-y-3 ml-4'>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                  <span>Clear language</span>
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                  <span>No marketing</span>
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                  <span>No hidden consent</span>
                </li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Acknowledgment Checkbox */}
            <div className='flex items-start space-x-3'>
              <input
                type='checkbox'
                id='acknowledge'
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className='mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
              />
              <label
                htmlFor='acknowledge'
                className='text-sm text-gray-700 leading-relaxed'
              >
                I acknowledge receipt of the Summary of Your Rights Under the
                Fair Credit Reporting Act (FCRA) and certify that I have read
                and understand this document.
              </label>
            </div>

            {/* Continue Button */}
            <div className='pt-6'>
              <button
                type='submit'
                disabled={!acknowledged}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  acknowledged
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DataDisclosureForm
