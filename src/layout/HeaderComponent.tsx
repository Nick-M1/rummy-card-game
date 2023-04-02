import {ReactNode} from "react";

type Props = {
    children: ReactNode
    displaynameText: string
}

export default function HeaderComponent({ children, displaynameText }: Props) {
    return (
        <div className="flex items-center space-x-2 w-full py-2">
            <img src="/brand-logo.png" alt="logo" className="w-8"/>
            <h1 className="flex-grow text-xl md:text-2xl font-semibold">Rummy Card Game</h1>

            <h1 className="">{ displaynameText }</h1>
            { children }
        </div>
    )
}