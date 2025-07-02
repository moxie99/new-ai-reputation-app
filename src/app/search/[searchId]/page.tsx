/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Download, Share2, ChevronRight } from 'lucide-react'
import { Report } from '../../../../types'

// Define the category keys type
type CategoryKey = keyof Report['categories']

export default function SearchResults() {
  const params = useParams()
  const searchId = params.searchId as string
  const [status, setStatus] = useState<any>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<CategoryKey | ''>('')
  const [isPolling, setIsPolling] = useState(true)

  // Separate function to fetch report (only called once)
  const fetchReport = useCallback(async () => {
    try {
      console.log('📄 Fetching report for search:', searchId)
      const response = await fetch(`/api/report/${searchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Report fetched successfully')
        setReport(data)

        // Only set initial active category if none is selected
        if (!activeCategory && data.categories) {
          const firstCategory = Object.keys(data.categories)[0] as CategoryKey
          console.log('🎯 Setting initial active category:', firstCategory)
          setActiveCategory(firstCategory)
        }

        setLoading(false)
        setIsPolling(false) // Stop polling once we have the report
      } else {
        console.error('❌ Failed to fetch report:', response.status)
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ Report fetch error:', error)
      setLoading(false)
    }
  }, [searchId, activeCategory])

  // Function to check status
  const checkStatus = useCallback(async () => {
    try {
      console.log('🔍 Checking status for search:', searchId)
      const response = await fetch(`/api/search/status/${searchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📊 Status update:', data.status, `${data.progress}%`)
        setStatus(data)

        // Only fetch report once when completed
        if (data.status === 'completed' && !report) {
          await fetchReport()
        } else if (data.status === 'failed') {
          console.log('❌ Search failed:', data.error)
          setLoading(false)
          setIsPolling(false)
        }
      } else {
        console.error('❌ Status check failed:', response.status)
      }
    } catch (error) {
      console.error('❌ Status check error:', error)
    }
  }, [searchId, report, fetchReport])

  useEffect(() => {
    // Initial status check
    checkStatus()

    // Set up polling only if we need to
    let interval: NodeJS.Timeout | null = null

    if (isPolling && !report) {
      console.log('⏰ Starting status polling...')
      interval = setInterval(() => {
        if (isPolling && !report) {
          checkStatus()
        }
      }, 3000) // Poll every 3 seconds (less aggressive)
    }

    return () => {
      if (interval) {
        console.log('🛑 Stopping status polling')
        clearInterval(interval)
      }
    }
  }, [checkStatus, isPolling, report])

  // Handle category selection
  const handleCategorySelect = (categoryKey: CategoryKey) => {
    console.log('🎯 Selecting category:', categoryKey)
    setActiveCategory(categoryKey)
  }

  if (
    loading ||
    (status && ['processing', 'queued', 'analyzing'].includes(status.status))
  ) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
          <div className='text-center'>
            <Loader2 className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>Analyzing Reputation</h2>
            <p className='text-gray-600 mb-6'>
              {status?.currentStep || 'Initializing search...'}
            </p>

            <div className='w-full bg-gray-200 rounded-full h-3 mb-2'>
              <div
                className='bg-blue-600 h-3 rounded-full transition-all duration-500'
                style={{ width: `${status?.progress || 0}%` }}
              />
            </div>
            <p className='text-sm text-gray-600'>
              {status?.progress || 0}% complete
            </p>

            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className='mt-4 p-2 bg-gray-100 rounded text-xs text-left'>
                <p>Status: {status?.status}</p>
                <p>Polling: {isPolling ? 'Yes' : 'No'}</p>
                <p>Has Report: {report ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (status?.status === 'failed') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
          <div className='text-center'>
            <div className='text-red-600 text-5xl mb-4'>⚠️</div>
            <h2 className='text-2xl font-bold mb-2'>Analysis Failed</h2>
            <p className='text-gray-600 mb-4'>
              {status.error || 'An error occurred during analysis'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
          <div className='text-center'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
            <p className='text-gray-600'>Loading report...</p>
          </div>
        </div>
      </div>
    )
  }

  console.log('🎯 Current active category:', activeCategory)
  console.log(
    '📋 Available categories:',
    Object.keys(report.categories) as CategoryKey[]
  )

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Report Header */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>
                Reputation Report: {report.targetPerson.name}
              </h1>
              <p className='text-blue-100'>
                Generated on {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
            <div className='flex gap-2'>
              <button className='bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center'>
                <Download className='w-4 h-4 mr-2' />
                Export
              </button>
              <button className='bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center'>
                <Share2 className='w-4 h-4 mr-2' />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className='bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Analysis Summary</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600'>
                {report.totalItemsAnalyzed}
              </div>
              <p className='text-gray-600'>Items Analyzed</p>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600'>
                {report.dataSourcesUsed.length}
              </div>
              <p className='text-gray-600'>Data Sources</p>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-purple-600'>
                {Object.values(report.categories).reduce(
                  (acc, cat) => acc + cat.flaggedContent.length,
                  0
                )}
              </div>
              <p className='text-gray-600'>Flagged Items</p>
            </div>
          </div>
        </div>

        {/* Report Categories */}
        <div className='bg-white rounded-b-lg shadow-sm'>
          <div className='flex border-b min-h-[600px]'>
            <div className='w-64 bg-gray-50 p-4'>
              <h3 className='font-semibold text-gray-700 mb-4'>Categories</h3>
              <nav className='space-y-1'>
                {(
                  Object.entries(report.categories) as [CategoryKey, any][]
                ).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => handleCategorySelect(key)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      activeCategory === key
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span className='text-sm'>{category.title}</span>
                    {category.flaggedContent.length > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activeCategory === key
                            ? 'bg-white/20 text-white'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {category.flaggedContent.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className='flex-1 p-8'>
              {activeCategory && activeCategory in report.categories ? (
                (() => {
                  const currentCategory = report.categories[activeCategory]
                  return (
                    <div>
                      <h2 className='text-2xl font-bold mb-4'>
                        {currentCategory.title}
                      </h2>

                      <div className='bg-blue-50 p-4 rounded-lg mb-6'>
                        <h3 className='font-semibold text-blue-900 mb-2'>
                          Summary
                        </h3>
                        <p className='text-gray-700'>
                          {currentCategory.summary}
                        </p>
                      </div>

                      {currentCategory.flaggedContent.length > 0 ? (
                        <div>
                          <h3 className='font-semibold text-gray-900 mb-4'>
                            Flagged Content (
                            {currentCategory.flaggedContent.length})
                          </h3>
                          <div className='space-y-4'>
                            {currentCategory.flaggedContent.map(
                              (flag, index) => (
                                <div
                                  key={index}
                                  className={`border rounded-lg p-4 ${
                                    flag.toxicityScore &&
                                    flag.toxicityScore > 0.7
                                      ? 'border-red-300 bg-red-50'
                                      : 'border-gray-200'
                                  }`}
                                >
                                  <div className='flex justify-between items-start mb-2'>
                                    <div className='flex-1'>
                                      <p className='font-medium text-gray-900 mb-1'>
                                        "{flag.quote}"
                                      </p>
                                      {flag.context && (
                                        <p className='text-sm text-gray-600'>
                                          {flag.context}
                                        </p>
                                      )}
                                    </div>
                                    {flag.toxicityScore && (
                                      <span
                                        className={`text-sm px-2 py-1 rounded ml-2 flex-shrink-0 ${
                                          flag.toxicityScore > 0.7
                                            ? 'bg-red-600 text-white'
                                            : flag.toxicityScore > 0.5
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-300 text-gray-700'
                                        }`}
                                      >
                                        {Math.round(flag.toxicityScore * 100)}%
                                        toxic
                                      </span>
                                    )}
                                  </div>
                                  <div className='flex items-center gap-4 text-sm text-gray-600'>
                                    <span>{flag.source}</span>
                                    <span>
                                      {new Date(flag.date).toLocaleDateString()}
                                    </span>
                                    <a
                                      href={flag.url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='text-blue-600 hover:underline flex items-center gap-1'
                                    >
                                      View Source
                                      <ChevronRight className='w-3 h-3' />
                                    </a>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <div className='text-green-600 text-4xl mb-2'>✅</div>
                          <p className='text-lg font-medium'>
                            No flagged content found
                          </p>
                          <p className='text-sm'>This category looks clean!</p>
                        </div>
                      )}
                    </div>
                  )
                })()
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>Select a category to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
