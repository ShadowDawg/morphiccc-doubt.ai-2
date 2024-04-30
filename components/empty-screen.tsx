import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: `What's the 2nd law of thermodynamics?`,
    message: `What's the 2nd law of thermodynamics?`
  },
  // {
  //   heading: `Explain Newton's 2nd law of motion and its application in pendulums.`,
  //   message: `Explain Newton's 2nd law of motion and its application in pendulums.`
  // },
  // {
  //   heading: `How does a hydrogen bomb work?🤐`,
  //   message: `How does a hydrogen bomb work?`
  // },
  {
    heading: `Teach me entropy beacause I wasted 11th grade.😔`,
    message: `Teach me entropy beacause I wasted 11th grade.`
  },
  {
    heading: `What's 9 + 10?🥵`,
    message: `What's 9 + 10?`
  },

]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
