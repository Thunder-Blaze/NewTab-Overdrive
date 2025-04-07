interface HeaderProps {
    label: string
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <p className="text-primary mt-4 mb-2 text-xl font-semibold">
                {label}
            </p>
        </div>
    )
}