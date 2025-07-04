'use client'

import { FileCheck, Flag, Monitor } from 'lucide-react'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      icon: FileCheck,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'UGC Creators for Quran AI report is ready',
      time: '12 min ago',
      hasIndicator: true,
    },
    {
      id: 2,
      icon: Flag,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Flagged Content detected on the Q2 UI UX Designer hiring Report',
      time: '12 min ago',
      hasIndicator: true,
    },
    {
      id: 3,
      icon: Monitor,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Facebook connected successfully',
      time: '36 min ago',
      hasIndicator: false,
    },
    {
      id: 4,
      icon: FileCheck,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'UGC Creators for Quran AI report is ready',
      time: '12 min ago',
      hasIndicator: false,
    },
    {
      id: 5,
      icon: Flag,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Flagged Content detected on the Q2 UI UX Designer hiring Report',
      time: '12 min ago',
      hasIndicator: false,
    },
    {
      id: 6,
      icon: Monitor,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Facebook connected successfully',
      time: '36 min ago',
      hasIndicator: false,
    },
    {
      id: 7,
      icon: FileCheck,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'UGC Creators for Quran AI report is ready',
      time: '12 min ago',
      hasIndicator: false,
    },
    {
      id: 8,
      icon: Flag,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Flagged Content detected on the Q2 UI UX Designer hiring Report',
      time: '12 min ago',
      hasIndicator: false,
    },
    {
      id: 9,
      icon: Monitor,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Facebook connected successfully',
      time: '36 min ago',
      hasIndicator: false,
    },
  ]

  return (
    <div className='flex h-screen '>
      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        {/* Header */}

        <h1 className='text-3xl font-bold text-gray-900 text-center'>
          Notifications
        </h1>

        {/* Notifications Content */}
        <div className='p-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='space-y-4'>
              {notifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <div
                    key={notification.id}
                    className='flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer'
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg ${notification.iconBg} flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${notification.iconColor}`}
                      />
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-base font-medium text-gray-900 mb-1 leading-tight'>
                        {notification.title}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {notification.time}
                      </p>
                    </div>

                    {/* Indicator */}
                    <div className='flex-shrink-0 pt-2'>
                      {notification.hasIndicator && (
                        <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
