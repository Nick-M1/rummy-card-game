import toast from "react-hot-toast";

type Props = {
    gameroomid: string
    width: string
}

export default function DisplayGameroomid({ gameroomid, width }: Props) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameroomid)
        toast('Gameroom ID copied to clipboard', { id: 'clipboard', icon: '📋' })
    }

    return (
        <h3 className='mx-auto flex items-center'>
            Gameroom ID:
            <div className={`p-2 ml-2 bg-white/5 hover:bg-white/10 active:bg-white/20 text-sm text-gray-400 rounded-lg truncate select-all cursor-pointer ${ width }`} onClick={copyToClipboard}>{ gameroomid }</div>
        </h3>
    )
}