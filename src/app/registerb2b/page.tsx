'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import AuthorizationForm from '@/components/authorizationform'
import BusinessForm from '@/components/businessform'
import CaliforniaPrivacyForm from '@/components/californiaprivacyform'
import DataDisclosureForm from '@/components/datadisclosureform'
import OnboardingForm from '@/components/onboardingform'
import PrivacyRightsForm from '@/components/privacyrightform'
import SuccessModal from '@/components/sucessodal'
import React, { useState } from 'react'

interface PersonalData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface BusinessData {
  businessName: string
  businessAddress: string
  businessAddressLine2: string
  usTaxId: string
}

function RegisterB2B() {
  const [currentStep, setCurrentStep] = useState(1)
  const [personalData, setPersonalData] = useState<PersonalData | null>(null)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handlePersonalFormSubmit = (data: PersonalData) => {
    setPersonalData(data)
    setCurrentStep(2)
  }

  const handleBusinessFormSubmit = (data: BusinessData) => {
    setBusinessData(data)
    setCurrentStep(3)
  }

  const handlePrivacyRightsSubmit = () => {
    setCurrentStep(4)
  }

  const handleDataDisclosureSubmit = () => {
    setCurrentStep(5)
  }

  const handleCaliforniaPrivacySubmit = () => {
    setCurrentStep(6)
  }

  const handleAuthorizationSubmit = () => {
    setShowSuccessModal(true)
  }

  const handleBackToPersonal = () => {
    setCurrentStep(1)
  }

  const handleBackToBusiness = () => {
    setCurrentStep(2)
  }

  const handleBackToPrivacyRights = () => {
    setCurrentStep(3)
  }

  const handleBackToDataDisclosure = () => {
    setCurrentStep(4)
  }

  const handleBackToCaliforniaPrivacy = () => {
    setCurrentStep(5)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <div className='min-h-screen'>
      {currentStep === 1 && (
        <OnboardingForm onNext={handlePersonalFormSubmit} />
      )}
      {currentStep === 2 && (
        <BusinessForm
          onNext={handleBusinessFormSubmit}
          onBack={handleBackToPersonal}
        />
      )}
      {currentStep === 3 && (
        <PrivacyRightsForm
          onNext={handlePrivacyRightsSubmit}
          onBack={handleBackToBusiness}
        />
      )}
      {currentStep === 4 && (
        <DataDisclosureForm
          onNext={handleDataDisclosureSubmit}
          onBack={handleBackToPrivacyRights}
        />
      )}
      {currentStep === 5 && (
        <CaliforniaPrivacyForm
          onNext={handleCaliforniaPrivacySubmit}
          onBack={handleBackToDataDisclosure}
        />
      )}
      {currentStep === 6 && (
        <AuthorizationForm
          onNext={handleAuthorizationSubmit}
          onBack={handleBackToCaliforniaPrivacy}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        redirectTo='/b2b'
      />
    </div>
  )
}

export default RegisterB2B
