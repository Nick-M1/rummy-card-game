import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import SigninPage from "../components/authentication/SigninPage";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../layout/LoadingPage";
import MenuLayout from "../layout/MenuLayout";

// Change to 'export function Component()'
export default function HomePage() {
    const navigate = useNavigate();
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined')
        return <SigninPage/>


    const handleGameroomRouter = (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        event.preventDefault()

        const gameroomId = formData.get('gameroom-id-input')
        navigate(`/${gameroomId}`)
    }


    return (
        <MenuLayout user={user}>
            <form onSubmit={handleGameroomRouter} className='bg-white/10 rounded-lg px-4 py-3 my-5 w-fit mx-auto outline outline-2 outline-gray-700 focus-within:outline-indigo-900 shadow-3xl smooth-transition'>
                <label htmlFor='gameroom-id-input' className='text-xl tracking-wide font-semibold'>Enter Gameroom ID:</label>

                <div className='flex space-x-2'>
                    <input id='gameroom-id-input' name="gameroom-id-input" type='text' placeholder='Gameroom ID...' className='input-primary'/>
                    <button className='btn-primary bg-white/10 hover:bg-white/20 focus:bg-white/30 mt-1'>Enter</button>
                </div>
            </form>
        </MenuLayout>
    )
}