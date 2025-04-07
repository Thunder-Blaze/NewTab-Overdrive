import React from 'react'
import ForensicsCard from './forensics-card'
import { FaSearchengin } from 'react-icons/fa'
import { FaUserXmark } from 'react-icons/fa6'
import { PiCircuitryFill } from 'react-icons/pi'

const Forensics = () => {
    const forensicCardData = [
        {
            icon: <FaSearchengin className="text-[7rem] text-accent" />,
            title: 'Faster Forensic Analysis',
            desc: 'The implementation of advanced technologies leads to quicker processing of forensic data, improving response times.',
        },
        {
            icon: <FaUserXmark className="text-[7rem] text-accent" />,
            title: 'Reduced Human Error',
            desc: 'Automation minimizes the potential for human mistakes in data analysis, promoting more accurate results.',
        },
        {
            icon: <PiCircuitryFill className="text-[7rem] text-accent" />,
            title: 'Enhanced Threat Detection',
            desc: 'Improved methodologies allow for better identification of threats, increasing overall security measures.',
        },
    ]

    return (
        <div className="w-full container mx-auto flex flex-col justify-center items-center p-8 gap-6">
            <h1 className="lg:text-3xl text-2xl xl:text-5xl font-jost font-bold animate-scale">
                Impacts and Benefits of Enhanced Forensics
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                {forensicCardData.map((card, index) => (
                    <ForensicsCard
                        key={index}
                        title={card.title}
                        desc={card.desc}
                        icon={card.icon}
                    />
                ))}
            </div>
        </div>
    )
}

export default Forensics
