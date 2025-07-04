'use client'
import { Download, Search, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'

const riskDistributionData = [
  { name: 'Low Risk', value: 3650, color: '#37BD80' },
  { name: 'Moderate Risk', value: 2520, color: '#E5C02A' },
  { name: 'High Risk', value: 521, color: '#E2723E' },
]

const riskTrendData = [
  { month: 'JAN', low: 400, moderate: 200, high: 100 },
  { month: 'FEB', low: 600, moderate: 300, high: 200 },
  { month: 'MAR', low: 800, moderate: 900, high: 400 },
  { month: 'APR', low: 700, moderate: 600, high: 500 },
]

export default function B2BDashboard() {
  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
        <button
          className=' px-6 py-2 text-white rounded-lg font-semibold'
          style={{
            display: 'inline-block',
            borderRadius: '10px',
            background: 'linear-gradient(#1C3AE3 0%, #5870F7 100%)',
          }}
        >
          Upload CSV
        </button>
      </div>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-xl shadow p-6 flex flex-col'>
          <div>
            <Image
              src='/total.png'
              alt='totalimage'
              height={38.91}
              width={31.42}
            />
            <div className='flex items-center justify-between'>
              <div className='gap-5'>
                <h5 className='text-xs text-gray-400 font-semibold mb-1'>
                  TOTAL REPORTS
                </h5>
                <h3 className='text-3xl font-bold mb-2'>520</h3>
              </div>
              <div>
                <Image
                  src='/totalChart.png'
                  alt='totalimage'
                  height={86}
                  width={148}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-6 flex flex-col'>
          <div>
            <Image
              src='/profile.png'
              alt='profile image'
              height={38.91}
              width={31.42}
            />
            <div className='flex items-center justify-between'>
              <div className='gap-5'>
                <h5 className='text-xs text-gray-400 font-semibold mb-1'>
                  PROFILE ANALYZED
                </h5>
                <h3 className='text-3xl font-bold mb-2'>6,890</h3>
              </div>
              <div>
                <Image
                  src='/profileChart.png'
                  alt='profile image'
                  height={86}
                  width={148}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-6 flex flex-col'>
          <div>
            <Image
              src='/risk.png'
              alt='alert image'
              height={38.91}
              width={31.42}
            />
            <div className='flex items-center justify-between'>
              <div className='gap-5'>
                <h5 className='text-xs text-gray-400 font-semibold mb-1'>
                  HIGH RISK FOUND
                </h5>
                <h3 className='text-3xl font-bold mb-2'>520</h3>
              </div>
              <div>
                <Image
                  src='/riskChart.png'
                  alt='risk image'
                  height={86}
                  width={148}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Upload CSV Section & Info Card */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='md:col-span-2 bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center'>
          <div className='bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4'>
            <Image src='/cvUpload.png' alt='cv upload' height={70} width={70} />
          </div>
          <div className='font-semibold text-lg mb-2'>Upload CSV File</div>
          <div className='text-gray-500 text-sm mb-4 text-center'>
            <p> Upload or drag and drop a CSV file to generate</p>
            <p>reports on multiple people</p>
          </div>
          <button
            className=' px-6 py-2 text-white rounded-lg font-semibold'
            style={{
              display: 'inline-block',
              borderRadius: '10px',
              background: 'linear-gradient(#1C3AE3 0%, #5870F7 100%)',
            }}
          >
            Upload File
          </button>
        </div>
        <div className='bg-white rounded-xl shadow p-6 flex flex-col gap-3'>
          <div className='font-semibold text-gray-800 mb-2'>
            What you will Get
          </div>
          <ul className='text-gray-600 text-sm space-y-5'>
            <li className='flex items-center gap-2'>
              <span className='text-[#5A636D]'>
                <Users className='w-5 h-5' />
              </span>{' '}
              Analyze up to 500 profiles at once with a single upload
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-[#5A636D]'>
                <Search className='w-5 h-5' />
              </span>{' '}
              Comprehensive multi-platform analysis
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-[#5A636D]'>
                <Download className='w-5 h-5' />
              </span>{' '}
              Instant downloadable reports
            </li>
          </ul>
        </div>
      </div>
      {/* Charts Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1 bg-white rounded-xl shadow p-6'>
          <div className='font-semibold mb-2'>Monthly Risk Distribution</div>
          <div className='flex flex-col items-center justify-center h-64'>
            <ResponsiveContainer width='100%' height={220}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={(entry: { name: string; percent?: number }) =>
                    `${entry.name.split(' ')[0]}: ${(
                      (entry.percent ?? 0) * 100
                    ).toFixed(0)}%`
                  }
                >
                  {riskDistributionData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number | string, name: string) => [
                    `${value}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='mt-4 w-full flex flex-col gap-1'>
              <div className='flex justify-between text-sm border border-[#EEEEEE] py-2 rounded-md px-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 rounded-full bg-[#37BD80]' />
                  <h3 className='text-green-500'> LOW RISK</h3>
                </div>
                <span>
                  <span className='font-semibold'> 3,650</span>{' '}
                  <span className='px-1 py-1 bg-[#E5EFF8] rounded-md'>52%</span>
                </span>
              </div>
              <div className='flex justify-between text-sm border border-[#EEEEEE] py-2 rounded-md px-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 rounded-full bg-[#E5C02A]' />
                  <h3 className='text-amber-400'> MODERATE RISK</h3>
                </div>
                <span>
                  <span className='font-semibold'> 2,520</span>{' '}
                  <span className='px-1 py-1 bg-[#E5EFF8] rounded-md'>30%</span>
                </span>
              </div>
              <div className='flex justify-between text-sm border border-[#EEEEEE] py-2 rounded-md px-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 rounded-full bg-[#E2723E]' />
                  <h3 className='text-[#E2723E]'> HIGH RISK</h3>
                </div>
                <span>
                  <span className='font-semibold'> 521</span>{' '}
                  <span className='px-1 py-1 bg-[#E5EFF8] rounded-md'>18%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='md:col-span-2 bg-white rounded-xl shadow p-6'>
          <div className='font-semibold mb-2'>Monthly Risk Trend</div>
          <div className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={riskTrendData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey='month' tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Legend
                  verticalAlign='top'
                  height={36}
                  iconType='circle'
                  formatter={(value) => {
                    if (value === 'low') return 'Low Risk'
                    if (value === 'moderate') return 'Moderate Risk'
                    if (value === 'high') return 'High Risk'
                    return value
                  }}
                />
                <Bar dataKey='low' stackId='a' fill='#37BD80' name='Low Risk' />
                <Bar
                  dataKey='moderate'
                  stackId='a'
                  fill='#E5C02A'
                  name='Moderate Risk'
                />
                <Bar
                  dataKey='high'
                  stackId='a'
                  fill='#E2723E'
                  name='High Risk'
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='flex justify-center gap-4 mt-4 text-xs'>
            <span className='flex items-center gap-1'>
              <span className='w-3 h-3 bg-green-400 rounded-full inline-block'></span>
              LOW RISK
            </span>
            <span className='flex items-center gap-1'>
              <span className='w-3 h-3 bg-yellow-400 rounded-full inline-block'></span>
              MODERATE RISK
            </span>
            <span className='flex items-center gap-1'>
              <span className='w-3 h-3 bg-orange-400 rounded-full inline-block'></span>
              HIGH RISK
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
