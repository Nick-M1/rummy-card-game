import { useNavigate } from "react-router-dom";
import MenuLayout from "../layout/MenuLayout";
import {useState} from "react";
import { v4 as uuidv4 } from 'uuid';


export function Component() {
    const navigate = useNavigate();
        const [gameroomid, setGameroomid] = useState('')

    const randomiseGameroomid = () => setGameroomid(uuidv4())

    const handleGameroomRouter = (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        event.preventDefault()

        const gameroomId = formData.get('gameroom-id-input')
        navigate(`/${gameroomId}`)
    }

    return (
        <MenuLayout>
            <form onSubmit={handleGameroomRouter} className='bg-white/10 rounded-lg px-4 py-3 my-5 w-fit mx-auto outline outline-2 outline-gray-700 focus-within:outline-indigo-900 shadow-3xl smooth-transition'>
                <label htmlFor='gameroom-id-input' className='pb-1 text-xl tracking-wide font-semibold'>Enter Gameroom ID:</label>

                <div className='flex space-x-2 mb-2'>
                    <input id='gameroom-id-input' name="gameroom-id-input" type='text' placeholder='Gameroom ID...' className='input-primary' value={gameroomid} onChange={(e) => setGameroomid(e.target.value)}/>
                    <button className='btn-primary bg-white/10 hover:bg-white/20 focus:bg-white/30 mt-1'>Enter</button>
                </div>

                <label htmlFor='gameroom-id-input' onClick={randomiseGameroomid} className='italic text-gray-400 hover:text-white cursor-pointer smooth-transition'>
                    Randomise Gameroom ID...
                </label>
            </form>
        </MenuLayout>
    )
}