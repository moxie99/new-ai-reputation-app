'use client'
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface CaliforniaPrivacyFormProps {
  onNext: () => void
  onBack: () => void
}

const CaliforniaPrivacyForm: React.FC<CaliforniaPrivacyFormProps> = ({
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
            style={{ width: '90%' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-start justify-center px-6 py-8'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-4'>
              Your California Privacy Rights and Disclosures
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              Under California law, you have specific rights to access and
              delete personal information. See details here.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8'>
            <div className='space-y-6 text-sm text-gray-700 leading-relaxed'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-3 uppercase tracking-wide text-xs'>
                  NOTICE REGARDING BACKGROUND CHECKS PER CALIFORNIA LAW
                </h3>

                <p className='mb-4'>
                  Ben chen (the "Company") intends to obtain information about
                  you for employment screening purposes from a consumer
                  reporting agency. Thus, you can expect to be the subject of an
                  "investigative consumer report" and a "consumer credit report"
                  obtained for employment purposes. Such reports may include
                  information about your character, general reputation, personal
                  characteristics and mode of living. With respect to any
                  investigative consumer report from an investigative consumer
                  reporting agency ("ICRA"), the Company may investigate the
                  information contained in your employment application and other
                  background information about you, including but not limited to
                  obtaining a criminal record report, verifying references, work
                  history, your social security number, your educational
                  achievements, licensure, and certifications, your driving
                  record, and other information about you, and interviewing
                  people who are knowledgeable about you. The results of this
                  report may be used as a factor in making employment decisions.
                  The source of any investigative consumer report (as that term
                  is defined under California law) will be Checkr, Inc., One
                  Montgomery Street, Suite 2400, San Francisco, CA 94104 | (844)
                  824-3257 | Help Center | Candidate Portal. The Company agrees
                  to provide you with a co...
                </p>
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

export default CaliforniaPrivacyForm
