/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ChevronRight,
  Calendar,
  Sparkles,
  FileSearch,
  Check,
  X,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  ChevronLeft,
  MoreVertical,
  Eye,
  Trash2,
  ArrowLeft,
  ArrowRight,
  DownloadCloud,
  Briefcase,
  Mail,
  ChevronDown,
  ArrowUpRight,
  Trophy,
  Medal,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

// Add dynamic import for chart to avoid SSR issues
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
})

export default function ConsentProcessPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [profileData, setProfileData] = useState([
    {
      id: 1,
      name: 'Baky Billah',
      role: 'Software Engineer',
      email: 'bakybillah63@gmail.com',
      riskLevel: 'Low',
      status: 'Consented',
      responseDate: '12 June 2025',
    },
    {
      id: 2,
      name: 'Jhon Smith',
      role: 'Vibe Coder',
      email: 'jhonsmith@gmail.com',
      riskLevel: 'Low',
      status: 'Consented',
      responseDate: '10 June 2025',
    },
    {
      id: 3,
      name: 'Juan Ella',
      role: 'Developer',
      email: 'juanella45@gmail.com',
      riskLevel: 'Moderate',
      status: 'Pending',
      responseDate: null,
    },
    {
      id: 4,
      name: 'Andrew Gosling',
      role: 'iOS Developer',
      email: 'goslingandrew@gmail.com',
      riskLevel: 'High',
      status: 'Declined',
      responseDate: '15 May 2025',
    },
    {
      id: 5,
      name: 'Peter Tinkle',
      role: 'ReactJS Developer',
      email: 'petertinkle@gmail.com',
      riskLevel: 'Moderate',
      status: 'Pending',
      responseDate: null,
    },
    {
      id: 6,
      name: 'Judas Pride',
      role: 'Software Engineer',
      email: 'judasprist@gmail.com',
      riskLevel: 'Low',
      status: 'Consented',
      responseDate: '12 May 2025',
    },
    {
      id: 7,
      name: 'Elenor Rugby',
      role: 'Vibe Coder',
      email: 'elenorrugby@gmail.com',
      riskLevel: 'High',
      status: 'Declined',
      responseDate: '8 May 2025',
    },
    {
      id: 8,
      name: 'Jhon Lemon',
      role: 'AI Engineer',
      email: 'jhonlemon@gmail.com',
      riskLevel: 'Low',
      status: 'Consented',
      responseDate: '12 June 2025',
    },
    {
      id: 9,
      name: 'Paul McCartney',
      role: 'ML Engineer',
      email: 'paulmichale@gmail.com',
      riskLevel: 'High',
      status: 'Declined',
      responseDate: '15 May 2025',
    },
    {
      id: 10,
      name: 'Lambrate Fogarty',
      role: 'Indie Hacker, Vibe coder',
      email: 'lambertefogarty@gmail.com',
      riskLevel: 'Moderate',
      status: 'Pending',
      responseDate: null,
    },
  ])

  const steps = [
    {
      id: 1,
      label: 'CSV file parsed successfully',
      completed: false,
      active: false,
    },
    { id: 2, label: 'Profile data extracted', completed: false, active: false },
    {
      id: 3,
      label: 'CSV file parsed successfully',
      completed: false,
      active: false,
    },
    {
      id: 4,
      label: 'Analysing social media presence',
      completed: false,
      active: false,
    },
    {
      id: 5,
      label: 'Generating risk assessments',
      completed: false,
      active: false,
    },
    {
      id: 6,
      label: 'Compiling final reports',
      completed: false,
      active: false,
    },
  ]

  const [stepStates, setStepStates] = useState(steps)
  const consentRequests = [
    {
      id: 1,
      title: 'UGC Creators for Quran AI',
      date: '10 June 2025',
      totalProfiles: 450,
      consented: 320,
      declined: 20,
      inProgress: 45,
    },
    {
      id: 2,
      title: 'HR Hiring 2024 Q4',
      date: '10 June 2025',
      totalProfiles: 450,
      consented: 320,
      declined: 20,
      inProgress: 45,
    },
    {
      id: 3,
      title: 'UI UX Designer hiring Q3',
      date: '10 June 2025',
      totalProfiles: 450,
      consented: 320,
      declined: 20,
      inProgress: 45,
    },
    {
      id: 4,
      title: 'Front-End developer hiring',
      date: '10 June 2025',
      totalProfiles: 450,
      consented: 320,
      declined: 20,
      inProgress: 45,
    },
    {
      id: 5,
      title: 'TikToker analysis',
      date: '10 June 2025',
      totalProfiles: 450,
      consented: 320,
      declined: 20,
      inProgress: 45,
    },
    {
      id: 6,
      title: 'Teacher analysis',
      date: '10 June 2025',
      totalProfiles: 450,
      consented: 320,
      declined: 20,
      inProgress: 45,
    },
  ]

  const tabs = [
    { name: 'All', count: profileData.length },
    {
      name: 'Pending',
      count: profileData.filter((p) => p.status === 'Pending').length,
    },
    {
      name: 'Consented',
      count: profileData.filter((p) => p.status === 'Consented').length,
    },
    {
      name: 'Declined',
      count: profileData.filter((p) => p.status === 'Declined').length,
    },
  ]

  const [viewedProfile, setViewedProfile] = useState<any>(null)

  useEffect(() => {
    if (showModal && !isComplete) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2

          // Update step states based on progress
          const newStepStates = stepStates.map((step, index) => {
            const stepProgress = ((index + 1) / steps.length) * 100
            return {
              ...step,
              completed: newProgress > stepProgress,
              active:
                newProgress >= stepProgress - 16 && newProgress <= stepProgress,
            }
          })
          setStepStates(newStepStates)

          if (newProgress >= 100) {
            clearInterval(timer)
            setTimeout(() => {
              setIsComplete(true)
            }, 500)
            return 100
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [showModal, isComplete])

  const handleSendConsent = () => {
    setShowModal(true)
    setProgress(0)
    setCurrentStep(0)
    setIsComplete(false)
    setStepStates(steps)
  }

  const closeModal = () => {
    setShowModal(false)
    setProgress(0)
    setCurrentStep(0)
    setIsComplete(false)
    setStepStates(steps)
  }
  const handleViewResults = () => {
    setShowResults(true)
    closeModal()
  }

  const handleCardClick = (request: any) => {
    setSelectedRequest(request)
    setShowResults(false)
  }

  const handleBackToList = () => {
    setSelectedRequest(null)
  }
  const handleDeleteProfile = (profileId: number) => {
    setProfileData((prev) => prev.filter((profile) => profile.id !== profileId))
  }
  const handleViewProfile = (profile: any) => {
    setViewedProfile(profile)
    setSelectedRequest(null)
  }

  const getRiskLevelColor = (level: any) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'Consented':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Declined':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  const filteredProfiles = profileData.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'All' || profile.status === activeTab
    return matchesSearch && matchesTab
  })

  if (showResults) {
    return (
      <div className='flex h-screen'>
        {/* Main Content */}
        <div className='flex-1 overflow-auto'>
          {/* Header */}
          <header className='bg-white px-8 py-2'>
            <h1 className='text-3xl font-bold text-gray-900 mt-2'>
              Consent Tracking
            </h1>
          </header>

          {/* Content */}
          <div className='p-8'>
            {/* Search and Filter Bar */}
            <div className='flex items-center justify-between mb-8'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <Input
                  placeholder='Search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 border border-[#eeeeee]'
                />
              </div>
              <div className='flex items-center space-x-3'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center space-x-2 border-[#eeeeee]'
                >
                  <Filter className='w-4 h-4' />
                  <span>All</span>
                </Button>
              </div>
            </div>

            {/* Consent Requests List */}
            <div className='space-y-4'>
              {consentRequests.map((request) => (
                <Card
                  key={request.id}
                  onClick={() => handleCardClick(request)}
                  className='hover:shadow-md transition-shadow border-[#eeeeee]'
                >
                  <CardContent className='px-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {request.title}
                        </h3>
                        <p className='text-sm text-gray-500'>{request.date}</p>
                      </div>

                      <div className='flex items-center space-x-8'>
                        {/* Total Profiles */}
                        <div className='flex items-center space-x-2 border rounded-lg border-[#eeeeee] px-4 py-1'>
                          <Users className='w-4 h-4 text-[#555555]' />
                          <span className='text-sm font-medium text-gray-900'>
                            {request.totalProfiles} Profiles
                          </span>
                        </div>

                        {/* Consented */}
                        <div className='flex items-center space-x-2 border rounded-lg border-[#eeeeee] px-4 py-1'>
                          <Shield className='w-4 h-4 text-[#555555]' />
                          <span className='text-sm font-medium text-gray-900'>
                            {request.consented} Consented
                          </span>
                        </div>

                        {/* Declined */}
                        <div className='flex items-center space-x-2 border rounded-lg border-[#eeeeee] px-4 py-1'>
                          <XCircle className='w-4 h-4 text-[#555555]' />
                          <span className='text-sm font-medium text-gray-900'>
                            {request.declined} Declined
                          </span>
                        </div>

                        {/* In Progress */}
                        <div className='flex items-center space-x-2 border rounded-lg border-[#eeeeee] px-4 py-1'>
                          <Clock className='w-4 h-4 text-[#555555]' />
                          <span className='text-sm font-medium text-gray-900'>
                            {request.inProgress} In Progress
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (viewedProfile) {
    const chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Sentiment',
          data: [70, 72, 75, 78, 80, 83, 85],
          fill: false,
          borderColor: '#37BD80',
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    }
    const chartOptions = {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      elements: {
        line: { borderWidth: 3 },
      },
      responsive: true,
      maintainAspectRatio: false,
    }
    return (
      <div>
        <header className='bg-white px-8 py-2 flex items-center justify-between py-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='flex items-center text-sm text-gray-500'>
                <span className='text-blue-600 font-medium'>REPORTS</span>
                <ChevronRight className='w-4 h-4 mx-2' />
                <span className='text-blue-600 font-medium'>
                  UI UX DESIGNER HIRING 2025 Q1
                </span>
                <ChevronRight className='w-4 h-4 mx-2' />
                <span className='text-[#777777] font-medium'>
                  {viewedProfile.name}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button className='flex items-center space-x-2 text-white bg-[#4880FF] hover:text-gray-900 rounded-full px-4 py-2'>
              <DownloadCloud className='w-4 h-4' />
              <span>Download PDF</span>
            </button>
            <button>
              <Image
                src='/share.png'
                alt='share button'
                height={45}
                width={45}
              />
            </button>
          </div>
        </header>
        <div className='flex h-screen border border-[#eeeeee] rounded-lg'>
          <div className='flex-1 overflow-auto py-8 px-8 mx-auto'>
            <div className='flex items-center justify-between mb-6 border-b-1 pb-6 border-[#eeeeee]'>
              <div className='flex items-center gap-4'>
                <Image
                  src='/human.png'
                  alt='avatar'
                  width={130}
                  height={130}
                  className='rounded-full'
                />
                <div>
                  <div className='text-xl font-bold text-gray-900 mb-1'>
                    {viewedProfile.name}
                  </div>
                  <div className='text-sm text-gray-500 flex items-center gap-1 mb-1'>
                    <Briefcase />
                    <span>
                      Software Engineer at Google | Previously at Apple
                    </span>
                  </div>
                  <div className='text-xs text-gray-400 flex items-center gap-1 mb-1'>
                    <Mail /> <span>{viewedProfile.email}</span>
                  </div>
                  <div className='flex gap-2 mt-2'>
                    <Badge className='bg-gray-100 text-gray-700'>
                      Philosophy
                    </Badge>
                    <Badge className='bg-gray-100 text-gray-700'>
                      Technology
                    </Badge>
                    <Badge className='bg-gray-100 text-gray-700'>Design</Badge>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <div className='flex items-center gap-2 bg-[#EFFFF4] rounded-full px-3 py-2'>
                  <div className='w-1.5 h-1.5 bg-[#13DE4D] rounded-lg' />
                  <span
                    className={`text-xs font-semibold px-2 py-1 text-[#13DE4D]`}
                  >
                    {viewedProfile.riskLevel} Risk
                  </span>
                </div>

                <div className='bg-[#FFF9F2] px-4 py-2 rounded-full flex items-center gap-2'>
                  <Image
                    src='/timer2.png'
                    height={15}
                    width={15}
                    alt='timer image'
                  />
                  <span className='text-xs text-[#FF981B]'>
                    Overall Score: 78/100
                  </span>
                </div>
                <div className='flex gap-2 mt-1'>
                  <Image
                    src='/linkedin.png'
                    alt='linkedin'
                    width={30}
                    height={30}
                  />
                  <Image src='/x.png' alt='twitter' width={30} height={30} />
                  <Image
                    src='/facebook.png'
                    alt='facebook'
                    width={30}
                    height={30}
                  />
                  <Image src='/ig.png' alt='instagram' width={30} height={30} />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-12 gap-8'>
              <div className='col-span-9 space-y-8'>
                <div className='grid grid-cols-2 gap-4'>
                  <Card className='border border-[#eeeeee]'>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                          <span className='font-bold text-[#000]'>
                            PROFESSIONAL STANDING
                          </span>
                          <Image
                            src='/info-circle.png'
                            height={18}
                            width={18}
                            alt='info circle image'
                          />
                        </div>
                        <div>
                          <span className='text-sm font-medium text-[#37BD80]'>
                            85/100
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Progress
                          value={85}
                          className='h-2 mt-2 bg-[#37BD80]'
                        />
                      </div>
                      <div className='py-1 px-2 border border-[#eeeeee] rounded-lg flex items-center justify-between mt-4'>
                        <h2 className='font-medium text-sm text-[#555555]'>
                          View 8 details
                        </h2>
                        <ChevronRight className='text-[#555555] w-3 h-4' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='border border-[#eeeeee]'>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                          <span className='font-bold text-[#000]'>
                            PUBLIC SENTIMENT
                          </span>
                          <Image
                            src='/info-circle.png'
                            height={18}
                            width={18}
                            alt='info circle image'
                          />
                        </div>
                        <div>
                          <span className='text-sm font-medium text-[#37BD80]'>
                            78/100
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Progress
                          value={78}
                          className='h-2 mt-2 bg-[#37BD80]'
                        />
                      </div>
                      <div className='py-1 px-2 border border-[#eeeeee] rounded-lg flex items-center justify-between mt-4'>
                        <h2 className='font-medium text-sm text-[#555555]'>
                          View 2 details
                        </h2>
                        <ChevronRight className='text-[#555555] w-3 h-4' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='border border-[#eeeeee]'>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                          <span className='font-bold text-[#000]'>
                            SOCIAL RISK PROFILE
                          </span>
                          <Image
                            src='/info-circle.png'
                            height={18}
                            width={18}
                            alt='info circle image'
                          />
                        </div>
                        <div>
                          <span className='text-sm font-medium text-[#FACC15]'>
                            45/100
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Progress
                          value={45}
                          className='h-2 mt-2 bg-[#FACC15]'
                        />
                      </div>
                      <div className='py-1 px-2 border border-[#eeeeee] rounded-lg flex items-center justify-between mt-4'>
                        <h2 className='font-medium text-sm text-[#555555]'>
                          View 2 details
                        </h2>
                        <ChevronRight className='text-[#555555] w-3 h-4' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='border border-[#eeeeee]'>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                          <span className='font-bold text-[#000]'>
                            IDENTITY CONSISTENCY
                          </span>
                          <Image
                            src='/info-circle.png'
                            height={18}
                            width={18}
                            alt='info circle image'
                          />
                        </div>
                        <div>
                          <span className='text-sm font-medium text-[#37BD80]'>
                            78/100
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Progress
                          value={78}
                          className='h-2 mt-2 bg-[#37BD80]'
                        />
                      </div>
                      <div className='py-1 px-2 border border-[#eeeeee] rounded-lg flex items-center justify-between mt-4'>
                        <h2 className='font-medium text-sm text-[#555555]'>
                          View 2 details
                        </h2>
                        <ChevronRight className='text-[#555555] w-3 h-4' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='border border-[#eeeeee]'>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                          <span className='font-bold text-[#000]'>
                            ONLINE EXPOSURE
                          </span>
                          <Image
                            src='/info-circle.png'
                            height={18}
                            width={18}
                            alt='info circle image'
                          />
                        </div>
                        <div>
                          <span className='text-sm font-medium text-[#37BD80]'>
                            75/100
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Progress
                          value={75}
                          className='h-2 mt-2 bg-[#37BD80]'
                        />
                      </div>
                      <div className='py-1 px-2 border border-[#eeeeee] rounded-lg flex items-center justify-between mt-4'>
                        <h2 className='font-medium text-sm text-[#555555]'>
                          View 2 details
                        </h2>
                        <ChevronRight className='text-[#555555] w-3 h-4' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='border border-[#eeeeee]'>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='text-xs text-gray-500 mb-1 flex items-center gap-2'>
                          <span className='font-bold text-[#000]'>
                            PERSONAL AUTHENTICITY
                          </span>
                          <Image
                            src='/info-circle.png'
                            height={18}
                            width={18}
                            alt='info circle image'
                          />
                        </div>
                        <div>
                          <span className='text-sm font-medium text-[#FACC15]'>
                            50/100
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Progress
                          value={50}
                          className='h-2 mt-2 bg-[#FACC15]'
                        />
                      </div>
                      <div className='py-1 px-2 border border-[#eeeeee] rounded-lg flex items-center justify-between mt-4'>
                        <h2 className='font-medium text-sm text-[#555555]'>
                          View 1 details
                        </h2>
                        <ChevronRight className='text-[#555555] w-3 h-4' />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Sentiment Overview & Flagged Content */}
                <div className='grid grid-cols-2 gap-6'>
                  {/* Sentiment Overview */}
                  <div className='col-span-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='font-semibold text-gray-900'>
                        Sentiment Overview
                      </div>
                      <div className='border rounded-lg border-[#eeeeee] flex items-center gap-2 px-2 py-1 '>
                        <span className='text-xs text-gray-500'>
                          Last 6 months
                        </span>
                        <ChevronDown />
                      </div>
                    </div>
                    <div className='mb-4'>
                      <h1 className='text-3xl font-bold text-blue-900 mr-2'>
                        85
                      </h1>
                      <div className='flex items-center gap-1'>
                        <span className='text-green-600 font-semibold flex items-center gap-1'>
                          <ArrowUpRight /> 10 (2.63%){' '}
                        </span>
                        <span className='font-light text-["#555555]'>
                          This month
                        </span>
                      </div>
                    </div>
                    {/* Chart */}
                    <div className='h-32 w-full mb-4'>
                      <Line
                        data={chartData}
                        options={chartOptions}
                        height={128}
                      />
                    </div>
                    <ul className='mt-2 space-y-2 text-sm'>
                      <li className='flex items-center justify-between border border-[#eeeeee] px-2 py-2 rounded-lg'>
                        <span className='text-[#5A636D] flex items-center gap-1'>
                          <div className='w-1.5 h-1.5 bg-green-600 rounded-full' />
                          Announced beta release of AI audit tool — huge
                          traction
                        </span>
                        <a href='#' className='text-blue-600 underline'>
                          View Post
                        </a>
                      </li>
                      <li className='flex items-center justify-between  border border-[#eeeeee] px-2 py-2 rounded-lg'>
                        <span className='text-[#5A636D] flex items-center gap-1'>
                          <div className='w-1.5 h-1.5 bg-green-600 rounded-full' />
                          Featured in Wired&apos;s Top 100 Innovators
                        </span>
                        <a href='#' className='text-blue-600 underline'>
                          View Post
                        </a>
                      </li>
                      <li className='flex items-center justify-between  border border-[#eeeeee] px-2 py-2 rounded-lg'>
                        <span className='text-[#5A636D] flex items-center gap-1'>
                          <div className='w-1.5 h-1.5 bg-green-600 rounded-full' />
                          Posted viral thread on startup mental health — 12k
                          likes
                        </span>
                        <a href='#' className='text-blue-600 underline'>
                          View Post
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Flagged Content */}
                  <div className='col-span-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                    <div className='font-semibold text-gray-900 mb-4'>
                      Flagged Contents
                    </div>
                    <ul className='space-y-4 text-sm'>
                      <li className='borderborder-[#eeeeee] rounded bg-[#F8F4F4] px-2 py-2'>
                        <div className='mb-2'>
                          &quot;Diversity hires are just companies trying to
                          look good. We shouldn&apos;t have to lower standards
                          to meet some quota&quot;
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex gap-2 mb-1'>
                            <Badge className='bg-[#F7ECEC] text-[#B83535]'>
                              Toxic
                            </Badge>
                            <Badge className='bg-[#F7ECEC] text-[#B83535]'>
                              Political Extremism
                            </Badge>
                          </div>

                          <div className='text-xs text-gray-400 mt-1'>
                            20 Jan 2025 | Source:{' '}
                            <a href='#' className='text-blue-600 underline'>
                              Twitter
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className='borderborder-[#eeeeee] rounded bg-[#F8F4F4] px-2 py-2'>
                        <div className='mb-2'>
                          The climate crisis is mostly a scam. It’s a power grab
                          disguised as science — and people are falling for it.
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex gap-2 mb-1'>
                            <Badge className='bg-[#F7ECEC] text-[#B83535]'>
                              Ant-science
                            </Badge>
                            <Badge className='bg-[#F7ECEC] text-[#B83535]'>
                              Polarizing political view
                            </Badge>
                          </div>

                          <div className='text-xs text-gray-400 mt-1'>
                            20 Jan 2025 | Source:{' '}
                            <a href='#' className='text-blue-600 underline'>
                              Reddit
                            </a>
                          </div>
                        </div>
                      </li>
                      <li className='borderborder-[#eeeeee] rounded bg-[#F8F4F4] px-2 py-2'>
                        <div className='mb-2'>
                          If you can’t handle pressure, you don’t belong in a
                          startup.
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex gap-2 mb-1'>
                            <Badge className='bg-[#F7ECEC] text-[#B83535]'>
                              Aggressive
                            </Badge>
                            <Badge className='bg-[#F7ECEC] text-[#B83535]'>
                              Toxic Leadership tone
                            </Badge>
                          </div>

                          <div className='text-xs text-gray-400 mt-1'>
                            20 Jan 2025 | Source:{' '}
                            <a href='#' className='text-blue-600 underline'>
                              Facebook
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <Button className='w-full border border-[#eeeeee] text-[#555555] mt-4'>
                      More Flagged Contents
                    </Button>
                  </div>
                </div>

                {/* Education and Profession */}

                <div className='grid grid-cols-2 gap-6'>
                  {/* Second Grid Item - Positive Marks */}
                  <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                    <div className='font-semibold text-gray-900 mb-4'>
                      POSITIVE MARKS
                    </div>

                    <div className='space-y-6'>
                      {/* Endorsements */}
                      <div className='flex items-start space-x-3 bg-[#F5FBFA] px-2 py-2 rounded-lg'>
                        <div className='flex-shrink-0'>
                          <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center'>
                            <Trophy className='w-5 h-5 text-teal-600' />
                          </div>
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-base font-semibold text-gray-900 mb-1'>
                            Endorsements
                          </h3>
                          <p className='text-sm text-gray-500'>
                            Recognized as "Employee of the Month" by leadership
                          </p>
                        </div>
                      </div>

                      {/* Clean Record */}
                      <div className='flex items-start space-x-3 bg-[#F5FBFA] px-2 py-2 rounded-lg'>
                        <div className='flex-shrink-0'>
                          <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center'>
                            <Shield className='w-5 h-5 text-teal-600' />
                          </div>
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-base font-semibold text-gray-900 mb-1'>
                            Clean Record
                          </h3>
                          <p className='text-sm text-gray-500'>
                            No controversial content detected in 2+ years
                          </p>
                        </div>
                      </div>

                      {/* Achievement */}
                      <div className='flex items-start space-x-3 bg-[#F5FBFA] px-2 py-2 rounded-lg '>
                        <div className='flex-shrink-0'>
                          <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center'>
                            <Medal className='w-5 h-5 text-teal-600' />
                          </div>
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-base font-semibold text-gray-900 mb-1'>
                            Achievement
                          </h3>
                          <p className='text-sm text-gray-500'>
                            Published article on industry best practices
                          </p>
                        </div>
                      </div>

                      {/* Community */}
                      <div className='flex items-start space-x-3 bg-[#F5FBFA] px-2 py-2 rounded-lg'>
                        <div className='flex-shrink-0'>
                          <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center'>
                            <Users className='w-5 h-5 text-teal-600' />
                          </div>
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-base font-semibold text-gray-900 mb-1'>
                            Community
                          </h3>
                          <p className='text-sm text-gray-500'>
                            Active volunteer at local tech meetups
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                    <div className='font-semibold text-gray-900 mb-4'>
                      Education and Profession
                    </div>
                    <ul className='space-y-3 text-sm'>
                      <li
                        className='flex items-center gap-2 text-[#002F6C] font-bold 
                      border border-[##eeeeee] rounded-md px-2 py-4'
                      >
                        <Image
                          src='/briefcase.svg'
                          height={15}
                          width={15}
                          alt='briefcase'
                        />{' '}
                        Product Designer at Orville{' '}
                        <span className='text-[#555555] ml-auto font-light'>
                          2020 - CURRENT
                        </span>
                      </li>
                      <li
                        className='flex items-center gap-2 text-[#002F6C] font-bold 
                      border border-[##eeeeee] rounded-md px-2 py-4'
                      >
                        <Image
                          src='/graduation-hat.png'
                          height={15}
                          width={15}
                          alt='graduate'
                        />{' '}
                        Graduated from MIT{' '}
                        <span className='text-[#555555] ml-auto font-light'>
                          2018 - 2020
                        </span>
                      </li>
                      <li
                        className='flex items-center gap-2 text-[#002F6C] font-bold 
                      border border-[##eeeeee] rounded-md px-2 py-4'
                      >
                        <Image
                          src='/briefcase.svg'
                          height={15}
                          width={15}
                          alt='brriefcase'
                        />{' '}
                        Graphic designer at DDC{' '}
                        <span className='text-[#555555] ml-auto font-light'>
                          2015 - 2018
                        </span>
                      </li>
                      <li
                        className='flex items-center gap-2 text-[#002F6C] font-bold 
                      border border-[##eeeeee] rounded-md px-2 py-4'
                      >
                        <Image
                          src='/briefcase.svg'
                          height={15}
                          width={15}
                          alt='brriefcase'
                        />{' '}
                        Graphic designer at DDC{' '}
                        <span className='text-[#555555] ml-auto font-light'>
                          2015 - 2018
                        </span>
                      </li>
                      <li
                        className='flex items-center gap-2 text-[#002F6C] font-bold 
                      border border-[##eeeeee] rounded-md px-2 py-4'
                      >
                        <Image
                          src='/briefcase.svg'
                          height={15}
                          width={15}
                          alt='brriefcase'
                        />{' '}
                        Graphic designer at DDC{' '}
                        <span className='text-[#555555] ml-auto font-light'>
                          2015 - 2018
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='border border-[#eeeeee] rounded-lg'>
                  <h4 className='py-2 px-4'>ANALYTIC INSIGHTS</h4>
                  <div className='flex items-center justify-between border-t border-[#eeeeee] py-2 px-4'>
                    <h3>Personality Tone:</h3>
                    <h3>Analytical, Assertive, Confident</h3>
                  </div>
                  <div className='flex items-center justify-between border-t border-[#eeeeee] py-2 px-4'>
                    <h3>Political Lean:</h3>
                    <h3>Libertarian-left</h3>
                  </div>
                  <div className='flex items-center justify-between border-t border-[#eeeeee] py-2 px-4'>
                    <h3>Network Cluster:</h3>
                    <h3>Connected to VCs, tech execs</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (selectedRequest) {
    return (
      <div className='flex h-screen'>
        {/* Main Content */}
        <div className='flex-1 overflow-auto'>
          {/* Header */}
          <header className='bg-white px-8 py-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='flex items-center text-sm text-gray-500'>
                  <span className='text-blue-600 font-medium'>
                    CONSENT TRACKING
                  </span>
                  <ChevronRight className='w-4 h-4 mx-2' />
                  <span>UI UX DESIGNER HIRING 2025 Q1</span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <h2 className='text-2xl font-bold text-[#002F6C]'>
                UI UX Designer hiring 2025 Q1
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleBackToList}
                className='flex items-center space-x-2 text-gray-600 hover:text-gray-900'
              >
                <ChevronLeft className='w-4 h-4' />
                <span>Back</span>
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className='p-8'>
            {/* Stats Cards */}
            <div className='grid grid-cols-4 gap-6 mb-8'>
              <Card className='border border-[#eeeeee]'>
                <CardContent>
                  <Image
                    src='/avatar-consent.png'
                    alt='avatar-image'
                    height={25}
                    width={25}
                  />
                  <div className='text-sm text-gray-600 mb-1 mt-2'>
                    Total Profiles
                  </div>
                  <div className='text-3xl font-bold text-blue-900'>520</div>
                </CardContent>
              </Card>

              <Card className='border border-[#eeeeee]'>
                <CardContent>
                  <Image
                    src='/shield-consent.png'
                    alt='avatar-image'
                    height={25}
                    width={25}
                  />
                  <div className='text-sm text-gray-600 mb-1 mt-2'>
                    Consented
                  </div>
                  <div className='text-3xl font-bold text-blue-900'>6,890</div>
                </CardContent>
              </Card>

              <Card className='border border-[#eeeeee]'>
                <CardContent>
                  <Image
                    src='/pending-consent.png'
                    alt='avatar-image'
                    height={25}
                    width={25}
                  />
                  <div className='text-sm text-gray-600 mb-1 mt-2'>Pending</div>
                  <div className='text-3xl font-bold text-blue-900'>45</div>
                </CardContent>
              </Card>

              <Card className='border border-[#eeeeee]'>
                <CardContent>
                  <Image
                    src='/reject-consent.png'
                    alt='avatar-image'
                    height={25}
                    width={25}
                  />
                  <div className='text-sm text-gray-600 mb-1 mt-2'>
                    Declined
                  </div>
                  <div className='text-3xl font-bold text-blue-900'>3</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className='flex items-center space-x-8 mb-6 border-b border-gray-200'>
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.name
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name} {tab.count}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className='bg-white rounded-lg shadow-sm border border-[#eeeeee]'>
              <Table>
                <TableHeader>
                  <TableRow className='border border-[#eeeeee]'>
                    <TableHead className='font-medium text-gray-500 uppercase tracking-wider py-3'>
                      NAME
                    </TableHead>
                    <TableHead className='font-medium text-gray-500 uppercase tracking-wider py-3'>
                      UPLOAD DATE
                    </TableHead>
                    <TableHead className='font-medium text-gray-500 uppercase tracking-wider py-3'>
                      RISK LEVEL
                    </TableHead>
                    <TableHead className='font-medium text-gray-500 uppercase tracking-wider py-3'>
                      STATUS
                    </TableHead>
                    <TableHead className='font-medium text-gray-500 uppercase tracking-wider py-3'>
                      RESPONSE DATE
                    </TableHead>
                    <TableHead className='w-12'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow
                      key={profile.id}
                      className='hover:bg-gray-50 border border-[#eeeeee]'
                    >
                      <TableCell>
                        <div>
                          <div className='font-medium text-gray-900'>
                            {profile.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {profile.role}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-sm text-gray-900'>
                        {profile.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRiskLevelColor(
                            profile.riskLevel
                          )} border-0`}
                        >
                          {profile.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            profile.status
                          )} border-0`}
                        >
                          {profile.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-sm text-gray-900'>
                        {profile.responseDate || '....'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='p-1 h-8 w-8'
                            >
                              <MoreVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-32'>
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('--+++', profile)
                                handleViewProfile(profile)
                              }}
                              className='flex items-center space-x-2'
                            >
                              <Eye className='w-4 h-4' />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProfile(profile.id)}
                              className='flex items-center space-x-2 text-red-600 focus:text-red-600'
                            >
                              <Trash2 className='w-4 h-4' />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between mt-6'>
              <Button
                variant='ghost'
                size='sm'
                className='flex items-center space-x-2'
              >
                <ArrowLeft className='w-4 h-4' />
                <span>Previous</span>
              </Button>

              <div className='flex items-center space-x-2'>
                {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                  <Button
                    key={index}
                    variant={page === 1 ? 'default' : 'ghost'}
                    size='sm'
                    className={`w-8 h-8 p-0 ${
                      page === 1 ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant='ghost'
                size='sm'
                className='flex items-center space-x-2'
              >
                <span>Next</span>
                <ArrowRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='flex h-screen'>
      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          showModal ? 'blur-sm' : ''
        }`}
      >
        {/* Header */}
        <header className='bg-white px-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='flex items-center text-sm text-gray-500'>
                <Link href='/b2b'>
                  <span className='text-blue-600 font-medium'>DASHBOARD</span>
                </Link>
                <ChevronRight className='w-4 h-4 mx-2' />
                <span>CONSENT PROCESS</span>
              </div>
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mt-2'>
            Setup Consent Process
          </h1>
        </header>

        {/* Content */}
        <div className='p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Main Content Area */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Email Template Section */}
              <Card className='border border-[#eeeeee]'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4 border-b border-[#eeeeee]'>
                  <CardTitle className='text-lg font-semibold text-gray-900'>
                    Email template
                  </CardTitle>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-blue-600 border-blue-200 hover:bg-blue-50'
                  >
                    <Sparkles className='w-4 h-4 mr-2' />
                    GENERATE BY AI
                  </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='text-sm text-gray-600 leading-relaxed'>
                    <p className='mb-4'>
                      Para información en español, visite{' '}
                      <a href='#' className='text-blue-600 underline'>
                        www.consumerfinance.gov/learnmore
                      </a>{' '}
                      o escriba a la Consumer Financial Protection Bureau, 1700
                      G Street NW, Washington, DC 20552.
                    </p>

                    <p className='font-semibold text-gray-900 mb-3'>
                      A Summary of Your Rights Under the Fair Credit Reporting
                      Act
                    </p>

                    <p className='mb-4'>
                      The federal Fair Credit Reporting Act (FCRA) promotes the
                      accuracy, fairness, and privacy of information in the
                      files of consumer reporting agencies. There are many types
                      of consumer reporting agencies, including credit bureaus
                      and specialty agencies (such as agencies that sell
                      information about check writing histories, medical
                      records, and rental history records). Here is a summary of
                      your major rights under FCRA. For more information,
                      including information about additional rights, go to{' '}
                      <a href='#' className='text-blue-600 underline'>
                        www.consumerfinance.gov/learnmore
                      </a>{' '}
                      or write to: Consumer Financial Protection Bureau, 1700 G
                      Street NW, Washington, DC 20552.
                    </p>

                    <ul className='space-y-3 ml-4'>
                      <li className='flex items-start'>
                        <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                        <span>
                          <strong>
                            You must be told if information in your file has
                            been used against you.
                          </strong>{' '}
                          Anyone who uses a credit report or another type of
                          consumer report to deny your application for credit,
                          insurance, or employment — or to take another adverse
                          action against you — must tell you, and must give you
                          the name, address, and phone number of the agency that
                          provided the information.
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                        <span>
                          <strong>
                            You have the right to know what is in your file.
                          </strong>{' '}
                          You may request and obt...
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Consent Deadline Section */}
              <Card className='border border-[#eeeeee]'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold text-gray-900'>
                    Consent Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='relative'>
                    <input
                      type='text'
                      placeholder='Select Deadline'
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10'
                    />
                    <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                  </div>

                  <div className='bg-[#F5F5F5] border border-[#F5F5F5] rounded-lg p-4'>
                    <h4 className='font-semibold text-[#164C63] mb-2'>
                      Recommended Timeline
                    </h4>
                    <p className='text-sm text-[#164C63]'>
                      Allow 5-7 business days for responses. Automatic reminders
                      will be sent 2 days before the deadline.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className='lg:col-span-1'>
              <Card className='sticky top-8 border border-[#eeeeee]'>
                <CardHeader>
                  <CardTitle className='text-lg font-semibold text-gray-900'>
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-600'>
                      Total Profiles
                    </span>
                    <span className='text-sm font-semibold text-gray-900'>
                      125
                    </span>
                  </div>

                  <Separator className='border border-[#eeeeee]' />

                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-600'>
                      Consent Deadline
                    </span>
                    <span className='text-sm font-semibold text-gray-900'>
                      8 June 2025
                    </span>
                  </div>

                  <Separator className='border border-[#eeeeee]' />

                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-600'>
                      Est Response time
                    </span>
                    <span className='text-sm font-semibold text-gray-900'>
                      7 day
                    </span>
                  </div>

                  <div className='pt-4'>
                    <Button
                      onClick={handleSendConsent}
                      className='w-full text-white rounded-lg font-semibold text-white'
                      style={{
                        display: 'inline-block',
                        borderRadius: '10px',
                        background: 'linear-gradient(#1C3AE3 0%, #5870F7 100%)',
                      }}
                    >
                      Send Consent Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className='max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden'>
          <DialogTitle className='sr-only'>
            {isComplete ? 'Analysis Complete' : 'Analyzing Profiles'}
          </DialogTitle>

          <div className='relative'>
            {/* Close button */}
            <Button
              variant='ghost'
              size='sm'
              onClick={closeModal}
              className='absolute top-4 right-4 z-10 h-8 w-8 p-0 hover:bg-gray-100'
            >
              <X className='w-4 h-4' />
            </Button>

            {!isComplete ? (
              /* Progress View */
              <div className='p-8 text-center'>
                {/* Icon */}
                <div className='w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-2xl flex items-center justify-center relative'>
                  <div className='absolute inset-0 border-4 border-blue-200 rounded-2xl animate-pulse'></div>
                  <FileSearch className='w-12 h-12 text-blue-600' />
                </div>

                {/* Title */}
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Analyzing Profiles
                </h2>
                <p className='text-gray-600 mb-8 max-w-sm mx-auto'>
                  Aggregating public data across platforms and generating
                  reports. This may take up to 1 minute
                </p>

                {/* Progress Bar */}
                <div className='mb-8'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm font-medium text-gray-900'>
                      Processing Files
                    </span>
                    <span className='text-sm font-medium text-gray-900'>
                      {Math.round((progress * 95) / 100)}/95
                    </span>
                  </div>
                  <Progress value={progress} className='h-2' />
                </div>

                {/* Steps */}
                <div className='space-y-3 text-left'>
                  {stepStates.map((step, index) => (
                    <div key={step.id} className='flex items-center space-x-3'>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                          step.completed
                            ? 'bg-green-500'
                            : step.active
                            ? 'bg-blue-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        {step.completed ? (
                          <Check className='w-3 h-3 text-white' />
                        ) : step.active ? (
                          <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                        ) : null}
                      </div>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          step.completed
                            ? 'text-gray-900 font-medium'
                            : step.active
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Completion View */
              <div className='p-8 text-center'>
                <div className='w-24 h-24 mx-auto mb-6 bg-green-50 rounded-2xl flex items-center justify-center'>
                  <Check className='w-12 h-12 text-green-600' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Analysis Complete!
                </h2>
                <p className='text-gray-600 mb-6'>
                  All 125 profiles have been successfully analyzed and consent
                  requests have been sent.
                </p>
                <Button
                  onClick={handleViewResults}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                >
                  View Results
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
