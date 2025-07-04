'use client'
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface PrivacyRightsFormProps {
  onNext: () => void
  onBack: () => void
}

const PrivacyRightsForm: React.FC<PrivacyRightsFormProps> = ({
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
            style={{ width: '54%' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-start justify-center px-6 py-8'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-4'>
              Understand Your Rights and Privacy Options
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              You have the right to request, review, correct, or delete any
              personal data we gather from public sources.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8'>
            <div className='space-y-6 text-sm text-gray-700 leading-relaxed'>
              <p>
                Para información en español, visite{' '}
                <a
                  href='https://www.consumerfinance.gov/'
                  className='text-blue-600 hover:text-blue-800 underline'
                >
                  www.consumerfinance.gov/
                </a>{' '}
                learnmore o escriba a la Consumer Financial Protection Bureau,
                1700 G Street NW, Washington, DC 20552.
              </p>

              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  A Summary of Your Rights Under the Fair Credit Reporting Act
                </h3>

                <p className='mb-4'>
                  The federal Fair Credit Reporting Act (FCRA) promotes the
                  accuracy, fairness, and privacy of information in the files of
                  consumer reporting agencies. There are many types of consumer
                  reporting agencies, including credit bureaus and specialty
                  agencies (such as agencies that sell information about check
                  writing histories, medical records, and rental history
                  records). Here is a summary of your major rights under FCRA.{' '}
                  <span className='font-medium'>
                    For more information, including information about additional
                    rights, go to
                  </span>{' '}
                  <a
                    href='https://www.consumerfinance.gov/learnmore'
                    className='text-blue-600 hover:text-blue-800 underline'
                  >
                    www.consumerfinance.gov/learnmore
                  </a>{' '}
                  or write to: Consumer Financial Protection Bureau, 1700 G
                  Street NW, Washington, DC 20552.
                </p>

                <ul className='space-y-3 ml-4'>
                  <li className='flex items-start'>
                    <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                    <span>
                      <strong>
                        You must be told if information in your file has been
                        used against you.
                      </strong>{' '}
                      Anyone who uses a credit report or another type of
                      consumer report to deny your application for credit,
                      insurance, or employment — or to take another adverse
                      action against you — must tell you, and must give you the
                      name, address, and phone number of the agency that
                      provided the information.
                    </span>
                  </li>
                </ul>
              </div>
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

export default PrivacyRightsForm
