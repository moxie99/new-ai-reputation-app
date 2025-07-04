'use client'
import type { NextPage } from 'next'
import { useMemo, type CSSProperties } from 'react'
import Image from 'next/image'

export type ProfileMetricsType = {
  className?: string
  group481855: string
  pROFILEANALYZED?: string
  prop?: string

  /** Style props */
  groupIconWidth?: CSSProperties['width']
  h2Width?: CSSProperties['width']
}

const ProfileMetrics: NextPage<ProfileMetricsType> = ({
  className = '',
  group481855,
  groupIconWidth,
  pROFILEANALYZED,
  prop,
  h2Width,
}) => {
  const groupIconStyle: CSSProperties = useMemo(() => {
    return {
      width: groupIconWidth,
    }
  }, [groupIconWidth])

  const h2Style: CSSProperties = useMemo(() => {
    return {
      width: h2Width,
    }
  }, [h2Width])

  return (
    <div
      className={`flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[25px] text-left text-base text-[#5a636d] font-['Abhaya_Libre'] ${className}`}
    >
      <div className='self-stretch flex flex-col items-start justify-start gap-[30.8px]'>
        <Image
          className='w-[38.5px] relative max-h-full shrink-0'
          loading='lazy'
          width={38.5}
          height={39.2}
          sizes='100vw'
          alt=''
          src={group481855}
          style={groupIconStyle}
        />
        <div className='self-stretch h-[78px] flex flex-col items-start justify-start gap-4 shrink-0'>
          <div className='self-stretch relative leading-[25px] font-medium'>
            {pROFILEANALYZED}
          </div>
          <h2
            className='m-0 w-[143px] relative text-[50px] leading-[560px] font-bold font-[ABeeZee] text-[#002f6c] inline-block mq450:text-3xl mq450:leading-[336px] mq900:text-[40px] mq900:leading-[448px]'
            style={h2Style}
          >
            {prop}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default ProfileMetrics
