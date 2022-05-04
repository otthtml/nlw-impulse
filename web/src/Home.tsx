import { ChatTeardropDots } from 'phosphor-react'
import { useState } from 'react'

export function Home() {
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);

    function toggleWidgetVisibility() {
        setIsWidgetOpen(!isWidgetOpen);
    }

    return (
        <div className='absolute bottom-4 right-4'>
            {isWidgetOpen ? <p>Hello World</p> : null}

            <button onClick={toggleWidgetVisibility} className='bg-violet-500 rounded-full p-3 h-12 text-white flex items-center group'>
                <ChatTeardropDots className='w-6 h-6'/>
                <span className='max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear'>
                    Feedback
                </span>
            </button>
        </div>
    )
}