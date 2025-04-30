interface TimelineItemProps {
  number: number
  isLast?: boolean
  title: string
  description: string
  isLeft?: boolean
}

export function VerticalTimeline() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col">
        <TimelineItem
          number={1}
          title="Create a Doubly Link"
          description="You give us any website URL and our system will give you a unique short link."
          isLeft={true}
        />
        <TimelineItem
          number={2}
          title="Share your Link with your audience"
          description="Share your Doubly link as you normally would - via Tweets, emails, blogs, or any maketing campaigns."
          isLeft={false}
        />
        <TimelineItem
          number={3}
          title="View detailed Analytics"
          description="Doubly will time, geographic, and device information on anyone who clicks on your Doubly links"
          isLeft={true}
        />
        <TimelineItem
          number={4}
          isLast
          title="Make better business decisions"
          description="See which links outperform, learn your audience, understand what people care about."
          isLeft={false}
        />
      </div>
    </div>
  )
}

function TimelineItem({ number, isLast = false, title, description, isLeft = true }: TimelineItemProps) {
  return (
    <div className="flex items-start">
      {/* Left Content - Only visible on desktop when isLeft is true */}
      <div className="hidden md:block w-1/2 pr-8">
        <div className="max-w-xs ml-auto">
          {isLeft && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--database-secondary)]">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white z-10">
          <span className="text-xl font-medium text-gray-900">{number}</span>
        </div>
        {!isLast && <div className="h-40 w-0.5 bg-gradient-to-b from-transparent via-[var(--database)] to-transparent"></div>}
      </div>

      {/* Right Content - Always visible on mobile, only visible on desktop when isLeft is false */}
      <div className="w-full md:w-1/2 pl-8">
        <div className="max-w-xs">
          {/* On mobile, always show content here */}
          <div className="md:hidden space-y-2">
            <h3 className="text-xl font-bold text-[var(--database-secondary)]">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* On desktop, only show when isLeft is false */}
          {!isLeft && (
            <div className="hidden md:block space-y-2">
              <h3 className="text-xl font-bold text-[var(--database-secondary)]">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
