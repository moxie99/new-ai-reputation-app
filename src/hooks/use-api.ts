/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useApi<T = any>(url: string, options?: UseApiOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async (body?: any) => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiClient(url, {
          method: body ? 'POST' : 'GET',
          body: body ? JSON.stringify(body) : undefined,
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || 'Request failed')
        }

        setData(responseData)
        options?.onSuccess?.(responseData)
        return responseData
      } catch (err) {
        const error = err as Error
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [url, options]
  )

  return { execute, loading, error, data }
}
