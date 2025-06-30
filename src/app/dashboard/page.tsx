/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth'
import { SearchForm } from '@/components/search-form'
import { Search, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { SearchRequest } from '../../../types'

export default function Dashboard() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'search' | 'history' | 'accounts'>(
    'search'
  )
  const [searches, setSearches] = useState<SearchRequest[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    twitter: false,
    linkedin: false,
    reddit: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      router.push('/login')
      return
    }

    fetchSearchHistory()
    fetchConnectedAccounts()
  }, [user, token, router])

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('/api/search/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearches(data)
      }
    } catch (error) {
      console.error('Error fetching search history:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/oauth/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConnectedAccounts(data)
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error)
    }
  }

  const handleConnect = async (provider: string) => {
    try {
      const response = await fetch(`/api/oauth/${provider}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const { authUrl } = await response.json()
        window.location.href = authUrl
      } else {
        console.error('Failed to get OAuth URL')
      }
    } catch (error) {
      console.error('OAuth error:', error)
    }
  }

  const handleDisconnect = async (provider: string) => {
    try {
      const response = await fetch(`/api/oauth/disconnect/${provider}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchConnectedAccounts()
      }
    } catch (error) {
      console.error('Error disconnecting account:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600 mt-2'>Welcome back, {user.email}</p>
        </div>

        {/* Tab Navigation */}
        <div className='bg-white rounded-lg shadow-sm mb-8'>
          <div className='border-b'>
            <div className='flex'>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className='w-5 h-5 inline-block mr-2' />
                New Search
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className='w-5 h-5 inline-block mr-2' />
                Search History
              </button>
              <button
                onClick={() => setActiveTab('accounts')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'accounts'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Connected Accounts
              </button>
            </div>
          </div>

          <div className='p-6'>
            {/* New Search Tab */}
            {activeTab === 'search' && <SearchForm />}

            {/* Search History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className='text-xl font-semibold mb-4'>Search History</h2>
                {loading ? (
                  <p className='text-gray-600'>Loading...</p>
                ) : searches.length === 0 ? (
                  <p className='text-gray-600'>
                    No searches yet. Start your first search!
                  </p>
                ) : (
                  <div className='space-y-4'>
                    {searches.map((search) => (
                      <div
                        key={search.id}
                        className='border rounded-lg p-4 hover:shadow-md transition-shadow'
                      >
                        <div className='flex justify-between items-start'>
                          <div>
                            <h3 className='font-semibold text-lg'>
                              {search.targetPerson.name}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {new Date(search.createdAt).toLocaleString()}
                            </p>
                            {search.targetPerson.email && (
                              <p className='text-sm text-gray-600'>
                                Email: {search.targetPerson.email}
                              </p>
                            )}
                          </div>
                          <div className='flex items-center gap-2'>
                            <StatusBadge status={search.status} />
                            {search.status === 'completed' && (
                              <button
                                onClick={() =>
                                  router.push(`/search/${search.id}`)
                                }
                                className='btn btn-primary text-sm'
                              >
                                View Report
                                <ExternalLink className='w-4 h-4 ml-1' />
                              </button>
                            )}
                          </div>
                        </div>
                        {search.status === 'processing' && (
                          <div className='mt-2'>
                            <div className='w-full bg-gray-200 rounded-full h-2'>
                              <div
                                className='bg-blue-600 h-2 rounded-full transition-all'
                                style={{ width: `${search.progress}%` }}
                              />
                            </div>
                            <p className='text-sm text-gray-600 mt-1'>
                              {search.currentStep}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Connected Accounts Tab */}
            {activeTab === 'accounts' && (
              <div>
                <h2 className='text-xl font-semibold mb-4'>
                  Connected Accounts
                </h2>
                <p className='text-gray-600 mb-6'>
                  Connect your social accounts to enhance search results with
                  authorized data access.
                </p>
                <div className='grid md:grid-cols-2 gap-4'>
                  {Object.entries(connectedAccounts).map(
                    ([provider, connected]) => (
                      <div key={provider} className='border rounded-lg p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='text-2xl'>
                              {getProviderIcon(provider)}
                            </div>
                            <div>
                              <h3 className='font-semibold capitalize'>
                                {provider}
                              </h3>
                              <p className='text-sm text-gray-600'>
                                {connected ? 'Connected' : 'Not connected'}
                              </p>
                            </div>
                          </div>
                          {connected ? (
                            <button
                              onClick={() => handleDisconnect(provider)}
                              className='btn btn-secondary text-sm'
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(provider)}
                              className='btn btn-primary text-sm'
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    processing: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    queued: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  }

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.queued
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}
    >
      <Icon className='w-3 h-3' />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function getProviderIcon(provider: string) {
  const icons = {
    google: '🔍',
    twitter: '𝕏',
    linkedin: '💼',
    reddit: '🟠',
  }
  return icons[provider as keyof typeof icons] || '🌐'
}
