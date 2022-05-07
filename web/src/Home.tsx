import { ArrowLeft, BugBeetle, Camera, ChatTeardropDots, Check, CircleNotch, Lamp, Question, Trash, X } from 'phosphor-react'
import { Popover } from '@headlessui/react'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import { api } from './lib/api'

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

export function Loading() {
    return (
        <div className='w-6 h-6 flex items-center justify-center overflow-hidden'>
            <CircleNotch className='bold w-6 h-4 animate-spin'/>
        </div>
    )
}

interface ScreenshotButtonProps {
    screenshot: string | null;
    setScreenshot: (screenshot: string | null) => void;
}

export function ScreenshotButton({screenshot, setScreenshot}: ScreenshotButtonProps) {
    const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);

    async function takeScreenshot() {
        setIsTakingScreenshot(true);
        const canvas = await html2canvas(document.querySelector('html')!);
        const base64img = canvas.toDataURL('image/png');
        setScreenshot(base64img);
        setIsTakingScreenshot(false);
    }

    if (screenshot) {
        return (
            <button
                type='button'
                className='p-1 w-10 h-10 rounded-md border-transparent flex justify-end items-end text-zinc-400 hover:text-zinc-100 transition-colors'
                onClick={() => setScreenshot(null)}
                style={{
                    backgroundImage: `url(${screenshot})`,
                    backgroundPosition: 'right bottom',
                    backgroundSize: 180,
                }}
            >
                <Trash weight='fill' />
            </button>
        )
    }

    return (
        <button
        type='button'
        className='p-2 bg-zing-800 rounded-md border-transparent hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-500'
        onClick={takeScreenshot}
        >
            { isTakingScreenshot ? <Loading/> : <Camera className='w-6 h-6 text-zinc-100'/> }
        </button>
    )
}

interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    returnToFeedbackType: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({
    feedbackType,
    returnToFeedbackType,
    onFeedbackSent,
}: FeedbackContentStepProps) {
    const [comment, setComment] = useState('');
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);

    const feedbackInfo = feedbackTypes[feedbackType];

    async function submitFeedback(event: React.FormEvent) {
        event.preventDefault();
        setIsSendingFeedback(true);
        await api.post('/feedback', {
            type: feedbackType,
            comment,
            screenshot
        });
        setIsSendingFeedback(false);
        onFeedbackSent();
    }

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

            <form onSubmit={submitFeedback} className='my-4 w-full'>
                <textarea 
                    className='min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-violet-500 focus:ring-violet-500 focus:ring-1 resize-none focus:outline-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin'
                    placeholder='Conte o que está acontecendo...'
                    onChange={(e) => setComment(e.target.value)}
                />
                <footer className='flex gap-2 mt-2'>
                    <ScreenshotButton
                        screenshot={screenshot}
                        setScreenshot={setScreenshot}
                    />
                    <button
                        disabled={comment.length === 0 || isSendingFeedback}
                        type='submit'
                        className='p-2 bg-violet-500 rounded-[4px] border-transparent flex-1 flex justify-center items-center text-sm hover:bg-violet-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-500 transition-colors disabled:opacity-50 disabled:hover:bg-violet-500'
                    >
                        {isSendingFeedback ? <Loading/> : 'Enviar feedback'}
                    </button>
                </footer>
            </form>
        </>
    )   
}

interface FeedbackSuccessStepProps {
    returnToFeedbackType: () => void;
}

export function FeedbackSuccessStep( {returnToFeedbackType}: FeedbackSuccessStepProps) {
    return (
        <>
            <header>
                <CloseButton/>
            </header>
            <div className='flex flex-col items-center py-10 w-[304px]'>
                <Check className='w-6 h-6'/>
                <span className='text-xl mt-2'>Agradecemos o feedback</span>
                <button
                    type='button'
                    onClick={returnToFeedbackType}
                    className='py-2 px-6 mt-6 bg-zinc-800 rounded-md border-transparent text-sm leading-6 hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-500'>
                    Quero enviar outro
                </button>
            </div>
        </>
    )
}

export function WidgetForm() {
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)
    const [feedbackSent, setFeedbackSent] = useState(false);

    function returnToFeedbackType() {
        setFeedbackSent(false);
        setFeedbackType(null);
    }

    return (
        <div className='bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem) md:w-auto] text-white'>
            { feedbackSent ? (
                <FeedbackSuccessStep returnToFeedbackType={returnToFeedbackType}/>
            ) : (
                <>
                    {!feedbackType ? (
                        <FeedbackTypeStep onFeedbackTypeChange={setFeedbackType} />
                    ) : (
                        <FeedbackContentStep 
                        feedbackType={feedbackType}
                        returnToFeedbackType={returnToFeedbackType}
                        onFeedbackSent={() => setFeedbackSent(true)}
                        />
                    )}
                </>
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