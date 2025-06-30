const features = [
  {
    icon: '🏢',
    title: 'Professional Analysis',
    description:
      'Employment history verification, career trajectory, and professional reputation assessment',
  },
  {
    icon: '💬',
    title: 'Tone & Language',
    description:
      'Communication style analysis with toxicity detection and language pattern identification',
  },
  {
    icon: '📊',
    title: 'Public Sentiment',
    description:
      'Third-party mentions, news coverage, and community perception analysis',
  },
  {
    icon: '🔄',
    title: 'Consistency Check',
    description:
      'Cross-platform verification and timeline consistency analysis',
  },
  {
    icon: '✨',
    title: 'Authenticity Score',
    description:
      'Original content analysis, personal storytelling depth, and community engagement quality',
  },
  {
    icon: '⚠️',
    title: 'Social Risk Profile',
    description:
      'Comprehensive toxicity screening, controversial content detection, and PR risk assessment',
  },
  {
    icon: '📈',
    title: 'Online Exposure',
    description:
      'Media presence quantification, platform reach analysis, and visibility metrics',
  },
  {
    icon: '🏆',
    title: 'Positive Markers',
    description:
      'Verified achievements, awards, leadership roles, and community contributions',
  },
]
export function Features() {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-4'>
          8 Comprehensive Analysis Categories
        </h2>
        <p className='text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto'>
          Our AI analyzes public data across multiple dimensions to provide a
          complete reputation profile. Every finding is traceable to its source
          with full transparency.
        </p>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((feature, index) => (
            <div key={index} className='bg-white p-6 rounded-xl card-shadow'>
              <div className='text-3xl mb-3'>{feature.icon}</div>
              <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
              <p className='text-gray-600 text-sm'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
