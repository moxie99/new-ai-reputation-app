'use client'
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface BusinessData {
  businessName: string
  businessAddress: string
  businessAddressLine2: string
  usTaxId: string
}

interface BusinessFormProps {
  onNext: (data: BusinessData) => void
  onBack: () => void
}

const BusinessForm: React.FC<BusinessFormProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState<BusinessData>({
    businessName: '',
    businessAddress: '',
    businessAddressLine2: '',
    usTaxId: '',
  })

  const [errors, setErrors] = useState<Partial<BusinessData>>({})

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<BusinessData> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required'
    }

    if (!formData.usTaxId.trim()) {
      newErrors.usTaxId = 'US Tax ID is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  const isFormValid =
    formData.businessName && formData.businessAddress && formData.usTaxId

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
            style={{ width: '36%' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-6'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-3'>
              Tell us about Your Business
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              Welcome! Set up your account to start generating comprehensive
              reputation reports in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Business Name Field */}
            <div>
              <label
                htmlFor='businessName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                BUSINESS NAME
              </label>
              <input
                type='text'
                id='businessName'
                value={formData.businessName}
                onChange={(e) =>
                  handleInputChange('businessName', e.target.value)
                }
                placeholder='Jhon Smith'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.businessName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.businessName && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.businessName}
                </p>
              )}
            </div>

            {/* Business Address Field */}
            <div>
              <label
                htmlFor='businessAddress'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                BUSINESS ADDRESS
              </label>
              <input
                type='text'
                id='businessAddress'
                value={formData.businessAddress}
                onChange={(e) =>
                  handleInputChange('businessAddress', e.target.value)
                }
                placeholder='Business address'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.businessAddress ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.businessAddress && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.businessAddress}
                </p>
              )}
            </div>

            {/* Business Address Line 2 Field */}
            <div>
              <input
                type='text'
                id='businessAddressLine2'
                value={formData.businessAddressLine2}
                onChange={(e) =>
                  handleInputChange('businessAddressLine2', e.target.value)
                }
                placeholder='Apt, Suite, Etc'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>

            {/* US Tax ID Field */}
            <div>
              <label
                htmlFor='usTaxId'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                US TAX ID
              </label>
              <input
                type='text'
                id='usTaxId'
                value={formData.usTaxId}
                onChange={(e) => handleInputChange('usTaxId', e.target.value)}
                placeholder='1-800-829-1040'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.usTaxId ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.usTaxId && (
                <p className='mt-1 text-sm text-red-600'>{errors.usTaxId}</p>
              )}
            </div>

            {/* Continue Button */}
            <div className='pt-6'>
              <button
                type='submit'
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isFormValid
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

export default BusinessForm
