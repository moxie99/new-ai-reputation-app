/* eslint-disable react/no-unescaped-entities */
export function Hero() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-24'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-5xl md:text-6xl font-bold gradient-text mb-6'>
            AI-Powered Reputation Analysis
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Deep 8-category analysis powered by GPT-4 and Google's Perspective
            API. From authenticity scoring to social risk assessment - every
            finding backed by direct source links.
          </p>
          <div className='flex justify-center gap-4'>
            <a href='#search' className='btn btn-primary'>
              Start Free Search
            </a>
            <a href='/dashboard' className='btn btn-secondary'>
              Sign In
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
