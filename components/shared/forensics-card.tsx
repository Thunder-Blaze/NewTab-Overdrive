import React from 'react'

type ForensicsCardProps = {
    icon: React.ReactNode
    title: string
    desc: string
}

const ForensicsCard: React.FC<ForensicsCardProps> = ({ icon, title, desc }) => {
    return (
        <div className="w-full p-1 py-4 md:p-4 md:py-8 bg-blue-900/10 rounded-lg flex flex-col justify-center items-center gap-4 animate-scale">
            <div className="flex justify-center items-center dark:bg-gradient-to-tl from-accent/5 to-accent/50 w-3/5 border-accent-foreground border-8 border-solid aspect-square rounded-full mb-2">
                {icon}
            </div>
            <h3 className="text-2xl text-center text-accent font-semibold">
                {title}
            </h3>
            <p className="text-center text-foreground/80">{desc}</p>
        </div>
    )
}

export default ForensicsCard
