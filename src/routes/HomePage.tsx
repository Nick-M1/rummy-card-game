import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import SigninPage from "../components/authentication/SigninPage";
import {signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";
import HeaderComponent from "../components/HeaderComponent";
import UserprofileDropdown from "../components/authentication/UserprofileDropdown";

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
        <div className='flex flex-col px-2 bg-neutral-800 w-screen h-screen text-gray-300'>
            <HeaderComponent displaynameText={`Welcome ${user.displayName}`}>
                <UserprofileDropdown user={user}/>
            </HeaderComponent>

            <div className='border-b border-neutral-700 w-full py-1'/>

            <img src='/homepage-icon.svg' alt='home-icon' className='h-[30dvh] w-fit mx-auto py-3'/>

            <form onSubmit={handleGameroomRouter} className='bg-white/10 rounded-lg px-4 py-3 my-5 w-fit mx-auto outline outline-2 outline-gray-700 focus-within:outline-indigo-900 shadow-3xl smooth-transition'>
                <label htmlFor='gameroom-id-input' className='text-xl tracking-wide font-semibold'>Enter Gameroom ID:</label>

                <div className='flex space-x-2'>
                    <input id='gameroom-id-input' name="gameroom-id-input" type='text' placeholder='Gameroom ID...' className='input-primary'/>
                    <button className='btn-primary bg-white/10 hover:bg-white/20 focus:bg-white/30 mt-1'>Enter</button>
                </div>
            </form>

            <div className='px-6'>
                <div className='bg-white/10 rounded-lg px-7 py-3 my-5 w-fit mx-auto text-gray-400 shadow-2xl'>
                    <h3 className='text-center text-lg font-semibold text-gray-300 pb-2'>Game Instructions - Rummy</h3>

                    <ol className='list-inside list-decimal list-image-[url(list-marker.svg)]'>
                        <li>HELLO nnnnnnnnnnnnnnnnnbbbbbbbbbbbbbbbbbbbbbbbn</li>
                        <li>HELLO nnnnnnnnnnnn</li>
                    </ol>

                </div>
            </div>
        </div>
    )
}