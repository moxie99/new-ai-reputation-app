/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface SearchProgressProps {
  searchId: string
  onComplete: (reportId: string) => void
  onError: (error: string) => void
}

export function SearchProgress({
  searchId,
  onComplete,
  onError,
}: SearchProgressProps) {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/search/status/${searchId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStatus(data)

          if (data.status === 'completed') {
            onComplete(data.reportId || searchId)
          } else if (data.status === 'failed') {
            onError(data.error || 'Analysis failed')
          }
        }
      } catch (error) {
        console.error('Status check error:', error)
      }
    }

    const interval = setInterval(checkStatus, 2000)
    checkStatus() // Initial check

    return () => clearInterval(interval)
  }, [searchId, onComplete, onError])

  return (
    <div className='text-center py-12'>
      <Loader2 className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' />
      <h3 className='text-xl font-semibold mb-2'>Analyzing Reputation</h3>
      <p className='text-gray-600 mb-6'>
        {status?.currentStep || 'Initializing...'}
      </p>

      <div className='max-w-md mx-auto'>
        <div className='w-full bg-gray-200 rounded-full h-3 mb-2'>
          <div
            className='bg-blue-600 h-3 rounded-full transition-all duration-500'
            style={{ width: `${status?.progress || 0}%` }}
          />
        </div>
        <p className='text-sm text-gray-600'>
          {status?.progress || 0}% complete
        </p>
      </div>
    </div>
  )
}
