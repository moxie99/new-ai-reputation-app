'use client'
import React, { useState } from 'react'
import {
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'

const stats = [
  {
    label: 'Total Reports',
    value: 520,
    icon: '/total.png',
    color: 'text-blue-600',
  },
  {
    label: 'Profile Analyzed',
    value: 6890,
    icon: '/profile.png',
    color: 'text-cyan-600',
  },
  {
    label: 'High Risk Found',
    value: 45,
    icon: '/risk.png',
    color: 'text-orange-600',
  },
  {
    label: 'Processing',
    value: 3,
    icon: '/processing.png',
    color: 'text-yellow-600',
  },
]

const dummyReports = [
  {
    name: 'UI UX Designer hiring 2025 Q1',
    date: 'Nov 20, 2025',
    status: 'Completed',
    risk: 35,
  },
  {
    name: 'HR Hiring 2024 Q4',
    date: 'Oct 20, 2025',
    status: 'Completed',
    risk: 0,
  },
  {
    name: 'UGC Creators for Quran AI',
    date: 'Oct 20, 2025',
    status: 'In Progress',
    risk: 15,
  },
  {
    name: 'Tiktoker Analysis',
    date: 'Oct 20, 2025',
    status: 'Completed',
    risk: 10,
  },
  {
    name: 'UGC Creators for Quran AI',
    date: 'Oct 20, 2025',
    status: 'In Progress',
    risk: 0,
  },
  {
    name: 'Tiktoker Analysis',
    date: 'Oct 20, 2025',
    status: 'Completed',
    risk: 8,
  },
  {
    name: 'UGC Creators for Quran AI',
    date: 'Oct 20, 2025',
    status: 'Completed',
    risk: 2,
  },
  {
    name: 'UI UX Designer hiring 2025 Q1',
    date: 'Oct 20, 2025',
    status: 'Completed',
    risk: 1,
  },
  {
    name: 'Teacher analysis for MIT',
    date: 'Oct 20, 2025',
    status: 'Completed',
    risk: 0,
  },
  {
    name: 'UI UX Designer hiring 2025 Q2',
    date: 'Oct 20, 2025',
    status: 'In Progress',
    risk: 0,
  },
]

const statusColor = {
  Completed: 'bg-green-100 text-green-600',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-600',
}

const riskColor = (risk: number) => {
  if (risk === 0) return 'bg-green-100 text-green-600'
  if (risk < 10) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-600'
}

export default function ReportsPage() {
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  return (
    <div className='flex flex-col w-full'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat, i) => (
          <div
            key={i}
            className='bg-white rounded-xl shadow p-6 flex flex-col gap-2 min-w-[180px]'
          >
            <Image
              src={stat.icon}
              alt='image for card'
              height={32.61}
              width={40.37}
            />
            <div className='flex items-center gap-3 text-[#5A636D] font-light'>
              {stat.label}
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2'>
        <div className='relative w-full md:w-1/3'>
          <input
            type='text'
            placeholder='Search'
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700'
          />
          <Search className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' />
        </div>
        <div className='flex items-center gap-2 mt-2 md:mt-0'>
          <button className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium'>
            All Reports <ChevronDown className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Table with shadcn/ui */}
      <div className='bg-white rounded-xl shadow overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='-[#EEEEEE]'>
              <TableHead className='text-left px-6 py-4 font-medium text-gray-400 text-xs'>
                NAME
              </TableHead>
              <TableHead className='text-left px-6 py-4 font-medium text-gray-400 text-xs'>
                UPLOAD DATE
              </TableHead>
              <TableHead className='text-left px-6 py-4 font-medium text-gray-400 text-xs'>
                STATUS
              </TableHead>
              <TableHead className='text-left px-6 py-4 font-medium text-gray-400 text-xs'>
                RISK FLAGS
              </TableHead>
              <TableHead className='px-6 py-4'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyReports.map((report, idx) => (
              <TableRow
                key={idx}
                className='border-b-[#EEEEEE] last:border-0 hover:bg-gray-50 group'
              >
                <TableCell className='px-6 py-4 whitespace-nowrap font-medium text-gray-900'>
                  {report.name}
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-gray-500'>
                  {report.date}
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColor[report.status as keyof typeof statusColor]
                    }`}
                  >
                    {report.status}
                  </span>
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${riskColor(
                      report.risk
                    )}`}
                  >
                    {report.risk}
                  </span>
                </TableCell>
                <TableCell className='px-6 py-4 text-right relative'>
                  <button
                    className='p-2 rounded-full hover:bg-gray-100'
                    onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}
                  >
                    <MoreVertical className='w-5 h-5 text-gray-400' />
                  </button>
                  {menuOpen === idx && (
                    <div className='absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-lg z-10'>
                      <button className='flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 text-gray-700'>
                        <Eye className='w-4 h-4' /> View
                      </button>
                      <button className='flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 text-gray-700'>
                        <Download className='w-4 h-4' /> Download
                      </button>
                      <button className='flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 text-red-500'>
                        <Trash2 className='w-4 h-4' /> Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between mt-6 px-2'>
        <button className='flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium'>
          <ChevronLeft className='w-4 h-4' /> Previous
        </button>
        <div className='flex items-center gap-1'>
          {[1, 2, 3, '...', 8, 9, 10].map((page, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-lg font-medium ${
                page === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button className='flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium'>
          Next <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}
