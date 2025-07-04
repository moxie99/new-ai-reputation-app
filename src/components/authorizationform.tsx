'use client'
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface AuthorizationFormProps {
  onNext: () => void
  onBack: () => void
}

const AuthorizationForm: React.FC<AuthorizationFormProps> = ({
  onNext,
  onBack,
}) => {
  const [authorized, setAuthorized] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (authorized) {
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
        <div className='w-9'></div>
      </div>

      {/* Progress Bar */}
      <div className='px-6 mb-8'>
        <div className='w-full bg-gray-200 rounded-full h-1'>
          <div
            className='bg-blue-500 h-1 rounded-full transition-all duration-500 ease-out'
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-start justify-center px-6 py-8'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-4'>
              Authorize Public Data Analysis and Reporting
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              By continuing, you authorize us to gather and analyze public data
              to generate reports on individuals you search.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8'>
            <div className='space-y-6 text-sm text-gray-700 leading-relaxed'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Acknowledgment and Authorization for Background Check
                </h3>

                <p className='mb-4'>
                  I acknowledge receipt of the separate documents entitled
                  Disclosure Regarding Background Investigation and A Summary of
                  Your Rights Under the Fair Credit Reporting Act and certify
                  that I have read and understand both of those documents. I
                  hereby authorize the obtaining of "consumer reports" and/or
                  "investigative consumer reports" by the Ben chen (the
                  "Requester") at any time after receipt of this authorization
                  and throughout my employment, if applicable. To this end, I
                  hereby authorize any law enforcement agency, administrator,
                  state or federal agency, institution, school or university
                  (public or private), information service bureau, past or
                  present employers, motor vehicle records agencies, or
                  insurance company to furnish any and all background
                  information requested by Checkr, Inc., One Montgomery Street,
                  Suite 2400, San Francisco, CA 94104 | (844) 824-3257 | Help
                  Center | Candidate Portal and/or the Requester. I agree that a
                  facsimile ("fax"), electronic, or photographic copy of this
                  Authorization shall be as valid as the original.
                </p>

                <p className='mb-4'>
                  <strong>New York residents/candidates only:</strong> Upon
                  request, you will be informed whether or not a consumer report
                  was requested by the Employer, and if such report was
                  requested, informed of the name and address of the consumer
                  reporting agency that furnished the report. You may inspect
                  and receive a copy of any investigative consumer report
                  requested by the Employer by contacting the consumer reporting
                  agency identified above directly.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Authorization Checkbox */}
            <div className='flex items-start space-x-3'>
              <input
                type='checkbox'
                id='authorize'
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                className='mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
              />
              <label
                htmlFor='authorize'
                className='text-sm text-gray-700 leading-relaxed'
              >
                By checking the box below, I authorize Boltshift Inc. and its
                third-party service providers to collect, analyze, and report
                public data about me...
              </label>
            </div>

            {/* Continue Button */}
            <div className='pt-6'>
              <button
                type='submit'
                disabled={!authorized}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  authorized
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

export default AuthorizationForm
