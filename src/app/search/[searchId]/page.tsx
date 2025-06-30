/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Download, Share2, ChevronRight } from 'lucide-react'
import { Report } from '../../../../types'

export default function SearchResults() {
  const params = useParams()
  const searchId = params.searchId as string
  const [status, setStatus] = useState<any>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')

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
            await fetchReport()
          } else if (data.status === 'failed') {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Status check error:', error)
      }
    }

    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${searchId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setReport(data)
          setActiveCategory(Object.keys(data.categories)[0])
          setLoading(false)
        }
      } catch (error) {
        console.error('Report fetch error:', error)
        setLoading(false)
      }
    }

    // Initial check
    checkStatus()

    // Poll for updates if still processing
    const interval = setInterval(() => {
      if (!report && status?.status !== 'failed') {
        checkStatus()
      } else {
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [searchId, report, status])

  if (loading || (status && status.status === 'processing')) {
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
            <p className='text-gray-600'>
              {status.error || 'An error occurred during analysis'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return null
  }

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
              <button className='btn bg-white/20 hover:bg-white/30 text-white'>
                <Download className='w-4 h-4 mr-2' />
                Export
              </button>
              <button className='btn bg-white/20 hover:bg-white/30 text-white'>
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
          <div className='flex border-b'>
            <div className='w-64 bg-gray-50 p-4'>
              <h3 className='font-semibold text-gray-700 mb-4'>Categories</h3>
              <nav className='space-y-1'>
                {Object.entries(report.categories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      activeCategory === key
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{category.title}</span>
                    {category.flaggedContent.length > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activeCategory === key
                            ? 'bg-white/20'
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
              {Object.entries(report.categories).map(([key, category]) => (
                <div
                  key={key}
                  className={activeCategory === key ? 'block' : 'hidden'}
                >
                  <h2 className='text-2xl font-bold mb-4'>{category.title}</h2>

                  <div className='bg-blue-50 p-4 rounded-lg mb-6'>
                    <h3 className='font-semibold text-blue-900 mb-2'>
                      Summary
                    </h3>
                    <p className='text-gray-700'>{category.summary}</p>
                  </div>

                  {category.flaggedContent.length > 0 && (
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-4'>
                        Flagged Content ({category.flaggedContent.length})
                      </h3>
                      <div className='space-y-4'>
                        {category.flaggedContent.map((flag, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 ${
                              flag.toxicityScore && flag.toxicityScore > 0.7
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className='flex justify-between items-start mb-2'>
                              <div>
                                <p className='font-medium text-gray-900'>
                                  "{flag.quote}"
                                </p>
                                {flag.context && (
                                  <p className='text-sm text-gray-600 mt-1'>
                                    {flag.context}
                                  </p>
                                )}
                              </div>
                              {flag.toxicityScore && (
                                <span
                                  className={`text-sm px-2 py-1 rounded ${
                                    flag.toxicityScore > 0.7
                                      ? 'bg-red-600 text-white'
                                      : flag.toxicityScore > 0.5
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-gray-300 text-gray-700'
                                  }`}
                                >
                                  {Math.round(flag.toxicityScore * 100)}% toxic
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
                        ))}
                      </div>
                    </div>
                  )}

                  {category.flaggedContent.length === 0 && (
                    <div className='text-center py-8 text-gray-500'>
                      <p>No flagged content found in this category.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
