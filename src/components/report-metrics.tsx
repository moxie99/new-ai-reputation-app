import type { NextPage } from 'next'
import Image from 'next/image'
import ProfileMetrics from './profile-metrics'

export type ReportMetricsType = {
  className?: string
}

const ReportMetrics: NextPage<ReportMetricsType> = ({ className = '' }) => {
  return (
    <section
      className={`h-[198px] flex flex-row items-end justify-start py-0 pl-0 pr-5 box-border gap-[78px] max-w-full text-left text-base text-[#5a636d] font-['Abhaya_Libre'] mq450:gap-[19px] mq900:gap-[39px] mq1275:flex-wrap ${className}`}
    >
      <div className='flex flex-col items-start justify-end pt-0 pb-[25px] pl-0 pr-[26px]'>
        <div className='self-stretch flex flex-col items-start justify-start gap-[30.8px]'>
          <div className='w-[45px] h-[39.2px] relative shrink-0'>
            <Image
              className='absolute top-[1.2px] left-[9.1px] w-[35.9px] h-[38px] object-contain'
              loading='lazy'
              width={35.9}
              height={38}
              sizes='100vw'
              alt=''
              src='/group-481832@2x.png'
            />
            <div className='absolute top-[0px] left-[0px] rounded-md [background:linear-gradient(180deg,_#b5dbff,_#ecf6ff)] w-[31.4px] h-[38.9px] z-[1]'>
              <div className='absolute top-[0px] left-[0px] rounded-md [background:linear-gradient(180deg,_#b5dbff,_#ecf6ff)] w-full h-full hidden' />
              <div className='absolute top-[8.2px] left-[4.5px] [background:linear-gradient(90deg,_#56a2eb,_#94c8fa)] w-[22.4px] h-[2.2px] z-[1]' />
              <div className='absolute top-[14.2px] left-[4.5px] [background:linear-gradient(90deg,_#57a3ec,_#93c7fa)] w-[22.4px] h-[2.2px] z-[1]' />
              <div className='absolute top-[20.2px] left-[4.5px] [background:linear-gradient(90deg,_#58a4ed,_#92c7fa)] w-[9.7px] h-[2.2px] z-[1]' />
            </div>
            <div className='absolute top-[8.2px] left-[4.5px] [background:linear-gradient(90deg,_#56a2eb,_#94c8fa)] w-[22.4px] h-[2.2px] z-[2]' />
            <div className='absolute top-[14.2px] left-[4.5px] [background:linear-gradient(90deg,_#57a3ec,_#93c7fa)] w-[22.4px] h-[2.2px] z-[2]' />
            <div className='absolute top-[20.2px] left-[4.5px] [background:linear-gradient(90deg,_#58a4ed,_#92c7fa)] w-[9.7px] h-[2.2px] z-[2]' />
          </div>
          <div className='self-stretch h-[78px] flex flex-col items-start justify-start gap-4 shrink-0'>
            <div className='relative leading-[25px] font-medium inline-block min-w-[123px]'>
              TOTAL REPORTS
            </div>
            <h1 className='m-0 w-[94px] relative text-[50px] leading-[560px] font-bold font-[ABeeZee] text-[#002f6c] inline-block mq450:text-3xl mq450:leading-[336px] mq900:text-[40px] mq900:leading-[448px]'>
              520
            </h1>
          </div>
        </div>
      </div>
      <div className='self-stretch w-[365px] flex flex-row items-end justify-start gap-[34px] max-w-full mq450:gap-[17px] mq450:flex-wrap'>
        <div className='flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[25px]'>
          <div className='flex-1 flex flex-row items-start justify-start gap-2'>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[67px] left-[0px] bg-[#5c73eb] w-1 h-[19px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[53px] left-[0px] bg-[#5c73eb] w-1 h-[33px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[75px] left-[0px] bg-[#5c73eb] w-1 h-[11px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[80px] left-[0px] bg-[#5c73eb] w-1 h-1.5 z-[1]' />
            </div>
            <div className='self-stretch w-1 relative bg-[#ebebed]' />
            <div className='self-stretch w-1 relative bg-[#ebebed]' />
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[70px] left-[0px] bg-[#5c73eb] w-1 h-4 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[59px] left-[0px] bg-[#5c73eb] w-1 h-[27px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[38px] left-[0px] bg-[#5c73eb] w-1 h-12 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[72px] left-[0px] bg-[#5c73eb] w-1 h-3.5 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[80px] left-[0px] bg-[#5c73eb] w-1 h-1.5 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[70px] left-[0px] bg-[#5c73eb] w-1 h-4 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[50px] left-[0px] bg-[#5c73eb] w-1 h-9 z-[1]' />
            </div>
          </div>
        </div>
        <div className='self-stretch w-px relative border-[#eee] border-solid border-r-[1px] box-border mq450:w-full mq450:h-px' />
        <ProfileMetrics
          group481855='/group-481855.svg'
          pROFILEANALYZED='PROFILE ANALYZED'
          prop='6,890'
        />
      </div>
      <div className='self-stretch w-[364px] flex flex-row items-end justify-start py-0 pl-0 pr-[9px] box-border gap-[33.5px] max-w-full mq450:gap-[17px] mq450:flex-wrap'>
        <div className='flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[25px]'>
          <div className='flex flex-row items-start justify-start gap-2'>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[67px] left-[0px] bg-[#7ccff2] w-1 h-[19px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[63px] left-[0px] bg-[#7ccff2] w-1 h-[23px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[75px] left-[0px] bg-[#7ccff2] w-1 h-[11px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[67px] left-[0px] bg-[#7ccff2] w-1 h-[19px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[49px] left-[0px] bg-[#7ccff2] w-1 h-[37px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[70px] left-[0px] bg-[#7ccff2] w-1 h-4 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[63px] left-[0px] bg-[#7ccff2] w-1 h-[23px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[59px] left-[0px] bg-[#7ccff2] w-1 h-[27px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[49px] left-[0px] bg-[#7ccff2] w-1 h-[37px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[61px] left-[0px] bg-[#7ccff2] w-1 h-[25px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[70px] left-[0px] bg-[#7ccff2] w-1 h-4 z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[63px] left-[0px] bg-[#7ccff2] w-1 h-[23px] z-[1]' />
            </div>
            <div className='h-[86px] w-1 relative bg-[#ebebed]'>
              <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
              <div className='absolute top-[70px] left-[0px] bg-[#7ccff2] w-1 h-4 z-[1]' />
            </div>
          </div>
        </div>
        <div className='self-stretch w-px relative border-[#eee] border-solid border-r-[1px] box-border mq450:w-full mq450:h-px' />
        <ProfileMetrics
          group481855='/group-481856.svg'
          groupIconWidth='44.8px'
          pROFILEANALYZED='HIGH RISK FOUND'
          prop='520'
          h2Width='94px'
        />
      </div>
      <div className='flex flex-col items-start justify-end pt-0 px-0 pb-[25px]'>
        <div className='flex-1 flex flex-row items-start justify-start gap-2'>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[67px] left-[0px] bg-[#fa6e2d] w-1 h-[19px] z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[53px] left-[0px] bg-[#fa6e2d] w-1 h-[33px] z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[75px] left-[0px] bg-[#fa6e2d] w-1 h-[11px] z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[80px] left-[0px] bg-[#fa6e2d] w-1 h-1.5 z-[1]' />
          </div>
          <div className='self-stretch w-1 relative bg-[#ebebed]' />
          <div className='self-stretch w-1 relative bg-[#ebebed]' />
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[70px] left-[0px] bg-[#fa6e2d] w-1 h-4 z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[59px] left-[0px] bg-[#fa6e2d] w-1 h-[27px] z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[38px] left-[0px] bg-[#fa6e2d] w-1 h-12 z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[72px] left-[0px] bg-[#fa6e2d] w-1 h-3.5 z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[80px] left-[0px] bg-[#fa6e2d] w-1 h-1.5 z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[70px] left-[0px] bg-[#fa6e2d] w-1 h-4 z-[1]' />
          </div>
          <div className='h-[86px] w-1 relative bg-[#ebebed]'>
            <div className='absolute top-[0px] left-[0px] bg-[#ebebed] w-full h-full hidden' />
            <div className='absolute top-[50px] left-[0px] bg-[#fa6e2d] w-1 h-9 z-[1]' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReportMetrics
