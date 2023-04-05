import MenuLayout from "../layout/MenuLayout";
import {Link} from "react-router-dom";
import DisplayGameroomid from "../components/shared/DisplayGameroomid";

type Props = {
    text: string
    buttonText: string
    gameroomid: string
    buttonHandler: () => Promise<void>
}

export default function StartGamePage({ text, buttonText, gameroomid, buttonHandler }: Props) {
    return (
        <MenuLayout>
            <h1 className='mx-auto w-fit py-3 text-2xl font-semibold tracking-wide'>
                { text }
            </h1>

            <div className='mx-auto w-fit pb-[2.35rem] md:pb-[2.85rem] grid grid-cols-3 space-x-2'>
                <Link to='/' className='btn-tertiary flex items-center h-12'>
                    Go Back
                </Link>

                <button onClick={buttonHandler} className='btn-primary col-span-2 flex justify-center items-center h-12'>
                    { buttonText }
                </button>
            </div>

            <DisplayGameroomid gameroomid={gameroomid} width='w-[20vw]'/>
        </MenuLayout>
    )
}