import { ArrowLeft, BugBeetle, ChatTeardropDots, Lamp, Question, X } from 'phosphor-react'
import { Popover } from '@headlessui/react'
import { useState } from 'react'

export function CloseButton() {
    return (
        <Popover.Button className='top-5 right-5 absolute text-zinc-400 hover:text-zinc-100' title='Fechar formulário de feedback'>
            <X className='w-4 h-4' weight='bold'/>
        </Popover.Button>
    )
}

const feedbackTypes = {
    BUG: {
        title: 'Problema',
        image: {
            source: <BugBeetle className='w-6 h-6' />,
            alt: 'Imagem de um bug'
        }
    },
    IDEA: {
        title: 'Ideia',
        image: {
            source: <Lamp className='w-6 h-6' />,
            alt: 'Imagem de uma lâmpada'
        }
    },
    OTHER: {
        title: 'Outro',
        image: {
            source: <Question className='w-6 h-6' />,
            alt: 'Imagem de um interrogação'
        }
    }
}

type FeedbackType = keyof typeof feedbackTypes;

interface FeedbackTypeStepProps {
    onFeedbackTypeChange: (feedbackType: FeedbackType) => void;
}

export function FeedbackTypeStep(props: FeedbackTypeStepProps) {
    return (
        <>
            <header>
                <span className='text-xl leading-6'>Deixe seu feedback</span>
                <CloseButton/>
            </header>
            <div className='flex py-8 gap-2 w-full'>
                { Object.entries(feedbackTypes).map( (item) => {
                    return (
                        <button
                            key={item[0]}
                            className='bg-zinc-800 rounded-lg py-5 w-24 flex-1 flex flex-col items-center gap-2 border-2 border-transparent hover:border-violet-500 focus:border-violet-500 focus:outline-none'
                            onClick={() => props.onFeedbackTypeChange(item[0] as FeedbackType)}
                            type='button'
                        >
                            {item[1].image.source}
                            <span>{item[1].title}</span>
                        </button>
                    )
                })}
            </div>
        </>
    )
}

interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    returnToFeedbackType: () => void;
}

export function FeedbackContentStep({ feedbackType, returnToFeedbackType }: FeedbackContentStepProps) {
    const feedbackInfo = feedbackTypes[feedbackType];

    return(
        <>
            <header>
                <button type='button'
                    className='top-5 left-5 absolute text-zinc-400 hover:text-zinc-100'
                    onClick={returnToFeedbackType}
                >
                    <ArrowLeft weight='bold' className='w-4 h-4' />

                </button>

                <span className='text-xl leading-6 flex items-center gap-2'>
                    {feedbackInfo.image.source}
                    {feedbackInfo.title}
                </span>
                <CloseButton/>
            </header>
            <div className='flex py-8 gap-2 w-full'>
            </div>
        </>
    )   
}

export function WidgetForm() {
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)

    function returnToFeedbackType() {
        setFeedbackType(null);
    }

    return (
        <div className='bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem) md:w-auto] text-white'>
            {!feedbackType ? (
                <FeedbackTypeStep onFeedbackTypeChange={setFeedbackType} />
            ) : (
                <FeedbackContentStep feedbackType={feedbackType} returnToFeedbackType={returnToFeedbackType} />
            )}

            <footer className='text-xs text-neutral-400'>
                Feito com amor pelo Octávio
            </footer>
        </div>
    )
}

export function Widget() {
    return (
        <Popover className='absolute bottom-4 right-4 flex flex-col items-end'>
            <Popover.Panel>
                <WidgetForm />
            </Popover.Panel>

            <Popover.Button className='bg-violet-500 rounded-full p-3 h-12 text-white flex items-center group'>
                <ChatTeardropDots className='w-6 h-6'/>
                <span className='max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear'>
                    Feedback
                </span>
            </Popover.Button>
        </Popover>
    )
}
export function Home() {

    return (
        <Widget/>
    )
}