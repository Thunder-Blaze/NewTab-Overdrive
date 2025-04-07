import React, { useState, useEffect, useRef } from 'react'
import * as SEicons from '@/assets/svgs/search_engines/SEicons'

type typeSearchEngine = {
    id: string
    name: string
    url: string
}

const searchEngines: typeSearchEngine[] = [
    {
        id: 'engine1',
        name: 'Google',
        url: 'https://www.google.com/search?q=',
    },
    {
        id: 'engine2',
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
    },
    { id: 'engine3', name: 'Bing', url: 'https://bing.com/?q=' },
    {
        id: 'engine4',
        name: 'Brave',
        url: 'https://search.brave.com/search?q=',
    },
    {
        id: 'engine5',
        name: 'Youtube',
        url: 'https://www.youtube.com/results?search_query=',
    },
]

const SearchApp: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isRecognizing, setIsRecognizing] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const [activeSearchEngine, setActiveSearchEngine] =
        useState<typeSearchEngine>({
            id: 'engine1',
            name: 'Google',
            url: 'https://www.google.com/search?q=',
        })
    const dropdownRef = useRef<HTMLDivElement>(null)

    const ActiveSEicon =
        SEicons[
            activeSearchEngine.name.toLowerCase() as keyof typeof SEicons
        ] || SEicons['search' as keyof typeof SEicons]

    useEffect(() => {
        const savedActiveSearchEngine =
            localStorage.getItem('activeSearchEngine')
        if (savedActiveSearchEngine) {
            setActiveSearchEngine(JSON.parse(savedActiveSearchEngine))
        }
    }, [])

    const saveActiveSearchEngine = (engine: typeSearchEngine) => {
        localStorage.setItem('activeSearchEngine', JSON.stringify(engine))
        setActiveSearchEngine(engine)
    }

    // Handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                event.target instanceof Element &&
                event.target.classList.contains('dropdown-item')
            ) {
                return
            }
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const performSearch = () => {
        if (searchTerm) {
            const searchUrl = `${activeSearchEngine.url}${encodeURIComponent(searchTerm)}`
            window.location.href = searchUrl
        }
    }

    const handleEngineChange = (engine: typeSearchEngine) => {
        saveActiveSearchEngine(engine)
    }

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

    return (
        <div className="search-app w-full max-w-[640px] h-16 outline outline-transparent has-[:focus]:outline-primary bg-background text-foreground transition-all ease-in-out duration-300 rounded-full outline-2 flex relative">
            {/* Search bar */}
            <div className="search-bar order-2 flex-1 flex">
                <input
                    type="text"
                    value={searchTerm}
                    className="bg-transparent flex-1 mr-12 outline-none border-none min-w-0 w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    placeholder={`${isRecognizing ? 'Listening...' : 'Type here...'}`}
                />
                <button
                    className="m-3 p-1.5 px-6 active:scale-90 transition-all rounded-full text-center bg-primary text-white text-[1.1rem]"
                    onClick={performSearch}
                >
                    Search
                </button>
            </div>

            {/* Dropdown for search engines */}
            <div
                className="dropdown order-1 w-16 h-full p-3.5"
                ref={dropdownRef}
            >
                <button
                    className="dropdown-btn rounded-full h-full aspect-square overflow-hidden"
                    onClick={toggleDropdown}
                >
                    {ActiveSEicon && (
                        <ActiveSEicon className="text-foreground dark:text-background invert dark:invert-0 w-9 h-9" />
                    )}
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-content absolute mt-4 w-full max-w-48 bg-background -ml-3.5 rounded-2xl overflow-hidden">
                        {searchEngines.map((engine: any) => {
                            const Icon =
                                SEicons[
                                    engine.name.toLowerCase() as keyof typeof SEicons
                                ] || SEicons['search' as keyof typeof SEicons]
                            return engine.url === activeSearchEngine.url ? (
                                ''
                            ) : (
                                <div
                                    key={engine.id}
                                    className={
                                        'dropdown-item cursor-pointer flex h-12 px-3.5 py-2 items-center gap-3 hover:bg-primary/20'
                                    }
                                    onClick={() => handleEngineChange(engine)}
                                >
                                    {Icon && (
                                        <Icon
                                            style={{ width: 'unset' }}
                                            className="text-background h-full aspect-square"
                                        />
                                    )}
                                    {engine.name}
                                </div>
                            )
                        })}
                        {}
                    </div>
                )}
            </div>

            {/* Voice search */}
            <VoiceSearch
                isRecognizing={isRecognizing}
                setIsRecognizing={setIsRecognizing}
                onSearch={(term) => setSearchTerm(term)}
            />
        </div>
    )
}

interface VoiceSearchProps {
    isRecognizing: boolean
    setIsRecognizing: React.Dispatch<React.SetStateAction<boolean>>
    onSearch: (term: string) => void
}

// VoiceSearch Component
const VoiceSearch: React.FC<VoiceSearchProps> = ({
    isRecognizing,
    setIsRecognizing,
    onSearch,
}) => {
    useEffect(() => {
        const isSpeechRecognitionAvailable =
            'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
        if (!isSpeechRecognitionAvailable) {
            console.warn(
                'Speech Recognition API not supported in this browser.'
            )
            return
        }

        const recognition = new ((window as any)?.SpeechRecognition ||
            (window as any)?.webkitSpeechRecognition)()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en'

        recognition.onstart = () => setIsRecognizing(true)
        recognition.onresult = (event: any) => {
            let transcript = ''
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript
            }
            onSearch(transcript)
        }
        recognition.onend = () => setIsRecognizing(false)
        recognition.onerror = () => setIsRecognizing(false)

        const handleMicClick = () => {
            if (isRecognizing) {
                recognition.stop()
            } else {
                recognition.start()
            }
        }

        const micIcon = document.getElementById('micIcon')
        micIcon?.addEventListener('click', handleMicClick)

        return () => {
            recognition.stop()
            micIcon?.removeEventListener('click', handleMicClick)
        }
    }, [isRecognizing, setIsRecognizing, onSearch])

    return (
        <div
            className={`mic-icon ${isRecognizing ? 'active' : ''} order-3 aspect-square p-3 h-full absolute right-28 mr-3`}
        >
            <svg
                id="micIcon"
                className="p-1 rounded-full relative cursor-pointer bg-muted text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -1 24 24"
                height="100%"
                width="100%"
            >
                <path
                    fill="currentColor"
                    d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2t2.125.875T15 5v6q0 1.25-.875 2.125T12 14m-1 7v-3.075q-2.6-.35-4.3-2.325T5 11h2q0 2.075 1.463 3.538T12 16t3.538-1.463T17 11h2q0 2.625-1.7 4.6T13 17.925V21z"
                />
            </svg>
        </div>
    )
}

export default SearchApp
