'use client'

import React, { useState } from 'react'
import { X, User, Lock, Building, Bell, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = 'account' | 'password' | 'company' | 'notifications'

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [formData, setFormData] = useState({
    // Account Settings
    name: 'Jhon Smith',
    email: 'youremail@gmail.com',
    phone: '+1 XXX XXX XXXX',
    // Password Settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // Company Info
    companyName: 'Observr Inc.',
    companyEmail: 'contact@observr.com',
    companyPhone: '+1 555 123 4567',
    address: '123 Business St, San Francisco, CA 94105',
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
  })

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Account Settings', icon: User },
    { id: 'password' as SettingsTab, label: 'Change Password', icon: Lock },
    { id: 'company' as SettingsTab, label: 'Company Info', icon: Building },
    {
      id: 'notifications' as SettingsTab,
      label: 'Notification Settings',
      icon: Bell,
    },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings:', formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop with blur */}
      <div
        className='absolute inset-0 bg-black/20 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-semibold text-gray-900'>Settings</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X size={20} className='text-gray-500' />
          </button>
        </div>

        <div className='flex h-[600px]'>
          {/* Sidebar */}
          <div className='w-80 bg-gray-50 border-r border-gray-200 p-6'>
            <nav className='space-y-2'>
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className='flex-1 p-6 overflow-y-auto'>
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                    Account Settings
                  </h3>

                  {/* Profile Picture */}
                  <div className='flex items-center gap-4 mb-8'>
                    <div className='relative'>
                      <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center'>
                        <span className='text-gray-400 text-2xl'>👤</span>
                      </div>
                      <button className='absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors'>
                        <Camera size={14} />
                      </button>
                    </div>
                    <div>
                      <h4 className='font-medium text-gray-900'>
                        Profile Picture
                      </h4>
                      <p className='text-sm text-gray-500'>
                        Upload a new profile picture
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-6'>
                    <div>
                      <Label
                        htmlFor='name'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        YOUR NAME
                      </Label>
                      <Input
                        id='name'
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='email'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        EMAIL ADDRESS
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='phone'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        PHONE NUMBER
                      </Label>
                      <div className='flex gap-2'>
                        <Select defaultValue='us'>
                          <SelectTrigger className='w-20'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='us'>🇺🇸</SelectItem>
                            <SelectItem value='uk'>🇬🇧</SelectItem>
                            <SelectItem value='ca'>🇨🇦</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id='phone'
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                          className='flex-1'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                >
                  SAVE
                </Button>
              </div>
            )}

            {/* Change Password */}
            {activeTab === 'password' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                    Change Password
                  </h3>

                  <div className='grid grid-cols-1 gap-6 max-w-md'>
                    <div>
                      <Label
                        htmlFor='currentPassword'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        CURRENT PASSWORD
                      </Label>
                      <Input
                        id='currentPassword'
                        type='password'
                        value={formData.currentPassword}
                        onChange={(e) =>
                          handleInputChange('currentPassword', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='newPassword'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        NEW PASSWORD
                      </Label>
                      <Input
                        id='newPassword'
                        type='password'
                        value={formData.newPassword}
                        onChange={(e) =>
                          handleInputChange('newPassword', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='confirmPassword'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        CONFIRM NEW PASSWORD
                      </Label>
                      <Input
                        id='confirmPassword'
                        type='password'
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>
                  </div>

                  <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                    <h4 className='font-medium text-blue-900 mb-2'>
                      Password Requirements:
                    </h4>
                    <ul className='text-sm text-blue-700 space-y-1'>
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number</li>
                      <li>• Contains at least one special character</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className='w-full bg-blue-600 hover:bg-blue-700'
                >
                  UPDATE PASSWORD
                </Button>
              </div>
            )}

            {/* Company Info */}
            {activeTab === 'company' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                    Company Information
                  </h3>

                  <div className='grid grid-cols-1 gap-6'>
                    <div>
                      <Label
                        htmlFor='companyName'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        COMPANY NAME
                      </Label>
                      <Input
                        id='companyName'
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange('companyName', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='companyEmail'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        COMPANY EMAIL
                      </Label>
                      <Input
                        id='companyEmail'
                        type='email'
                        value={formData.companyEmail}
                        onChange={(e) =>
                          handleInputChange('companyEmail', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='companyPhone'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        COMPANY PHONE
                      </Label>
                      <Input
                        id='companyPhone'
                        value={formData.companyPhone}
                        onChange={(e) =>
                          handleInputChange('companyPhone', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='address'
                        className='text-sm font-medium text-gray-700 mb-2 block'
                      >
                        COMPANY ADDRESS
                      </Label>
                      <Input
                        id='address'
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        className='w-full'
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className='w-full bg-blue-600 hover:bg-blue-700'
                >
                  SAVE COMPANY INFO
                </Button>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                    Notification Settings
                  </h3>

                  <div className='space-y-6'>
                    <div className='flex items-center justify-between py-4 border-b border-gray-200'>
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          Email Notifications
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) =>
                          handleInputChange('emailNotifications', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between py-4 border-b border-gray-200'>
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          Push Notifications
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Receive push notifications in browser
                        </p>
                      </div>
                      <Switch
                        checked={formData.pushNotifications}
                        onCheckedChange={(checked) =>
                          handleInputChange('pushNotifications', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between py-4 border-b border-gray-200'>
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          Weekly Reports
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Get weekly summary reports
                        </p>
                      </div>
                      <Switch
                        checked={formData.weeklyReports}
                        onCheckedChange={(checked) =>
                          handleInputChange('weeklyReports', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between py-4'>
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          Security Alerts
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Important security notifications
                        </p>
                      </div>
                      <Switch
                        checked={formData.securityAlerts}
                        onCheckedChange={(checked) =>
                          handleInputChange('securityAlerts', checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className='w-full bg-blue-600 hover:bg-blue-700'
                >
                  SAVE PREFERENCES
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
