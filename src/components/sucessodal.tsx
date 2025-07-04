/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { CheckCircle, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string // Optional route to navigate to
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  redirectTo,
}) => {
  const router = useRouter()

  if (!isOpen) return null

  const handleClose = () => {
    if (redirectTo) {
      router.push(redirectTo)
    }
    onClose()
  }

  const handleProceedToDashboard = () => {
    if (redirectTo) {
      router.push(redirectTo)
    }
    onClose()
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
          <div className='flex items-center space-x-3'>
            <Image src='/logo.png' alt='logo' height={29} width={37.27} />
            <span className='font-semibold text-gray-900'>Observr</span>
          </div>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-400' />
          </button>
        </div>

        {/* Content */}
        <div className='p-8 text-center'>
          <div className='mb-6'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Successfully Onboarded!
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              Welcome to Observr! Your account has been successfully set up and
              you're ready to start generating comprehensive reputation reports.
            </p>
          </div>

          <div className='space-y-3'>
            <button
              onClick={handleProceedToDashboard}
              className=' px-6 py-2 text-white rounded-lg font-semibold'
              style={{
                display: 'inline-block',
                borderRadius: '10px',
                background: 'linear-gradient(#1C3AE3 0%, #5870F7 100%)',
              }}
            >
              Proceed to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
