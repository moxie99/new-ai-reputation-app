'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import { Upload, Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
const searchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().optional().or(z.literal('')),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  reddit: z.string().optional(),
  youtube: z.string().optional(),
})

type SearchFormData = z.infer<typeof searchSchema>

export function SearchForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setPhoto(acceptedFiles[0]),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  })

  const onSubmit = async (data: SearchFormData) => {
    setIsSubmitting(true)

    try {
      const token = sessionStorage.getItem('auth-token')
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.email) formData.append('email', data.email)

      const socialHandles = {
        twitter: data.twitter,
        linkedin: data.linkedin,
        github: data.github,
        reddit: data.reddit,
        youtube: data.youtube,
      }

      formData.append('socialHandles', JSON.stringify(socialHandles))
      if (photo) formData.append('photo', photo)

      const response = await fetch('/api/search/start', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token} || ''}`,
        },
      })
      console.log('frontend error', response)
      if (response.ok) {
        const { searchId } = await response.json()
        router.push(`/search/${searchId}`)
      } else {
        // throw new Error('Failed to start search')
        toast.error('Failed to start search')
        return
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to start search. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id='search' className='max-w-2xl mx-auto'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white p-8 rounded-xl shadow-lg'
      >
        <h3 className='text-2xl font-bold mb-6'>Start Reputation Search</h3>

        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Full Name *
            </label>
            <input
              {...register('name')}
              type='text'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='John Doe'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Email (optional)
            </label>
            <input
              {...register('email')}
              type='email'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='john@example.com'
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Social Media Handles (optional)
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <input
                {...register('twitter')}
                type='text'
                className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Twitter/X username'
              />
              <input
                {...register('linkedin')}
                type='text'
                className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='LinkedIn username'
              />
              <input
                {...register('github')}
                type='text'
                className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='GitHub username'
              />
              <input
                {...register('reddit')}
                type='text'
                className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Reddit username'
              />
              <input
                {...register('youtube')}
                type='text'
                className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='YouTube channel'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Photo (optional)
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
                ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <input {...getInputProps()} />
              <Upload className='w-8 h-8 mx-auto mb-2 text-gray-400' />
              {photo ? (
                <p className='text-sm text-gray-600'>Selected: {photo.name}</p>
              ) : (
                <p className='text-sm text-gray-600'>
                  Drag & drop a photo here, or click to select
                </p>
              )}
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              Upload a photo for facial matching across platforms
            </p>
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' />
                Starting Search...
              </>
            ) : (
              <>
                <Search className='w-5 h-5' />
                Start Search
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
