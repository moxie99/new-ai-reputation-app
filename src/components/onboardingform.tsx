'use client'
import React, { useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface OnboardingFormProps {
  onNext: (data: FormData) => void
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    /\S+@\S+\.\S+/.test(formData.email)

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between p-6'>
        <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
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
            style={{ width: '18%' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-6'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-3'>
              Tell us about Yourself
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              Welcome! Set up your account to start generating comprehensive
              reputation reports in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Name Field */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                YOUR NAME
              </label>
              <input
                type='text'
                id='name'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder='Jhon Smith'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                EMAIL ADDRESS
              </label>
              <input
                type='email'
                id='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder='youremail@gmail.com'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                PHONE NUMBER
              </label>
              <div className='flex'>
                <div className='flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50'>
                  <span className='text-sm text-gray-600'>🇺🇸</span>
                </div>
                <input
                  type='tel'
                  id='phone'
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder='+1 XXX XXX XXXX'
                  className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className='mt-1 text-sm text-red-600'>{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                PASSWORD
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  placeholder='Enter Password'
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                CONFIRM PASSWORD
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  placeholder='Confirm Password'
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.confirmPassword}
                </p>
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

export default OnboardingForm
