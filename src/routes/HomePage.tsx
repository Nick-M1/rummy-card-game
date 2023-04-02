import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import SigninPage from "../components/authentication/SigninPage";
import {signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";

export default function HomePage() {
    const navigate = useNavigate();
    const [user, userLoading, userError] = useAuthState(auth)

    // if (userLoading)
        return <LoadingPage/>
    // if (user == null || typeof userError != 'undefined')
    //     return <SigninPage/>
    //
    //
    // const handleGameroomRouter = (event: React.FormEvent<HTMLFormElement>) => {
    //     const formData = new FormData(event.currentTarget);
    //     event.preventDefault()
    //
    //     const gameroomId = formData.get('gameroom-id-input')
    //     navigate(`/${gameroomId}`)
    // }
    //
    //
    // return (
    //     <div className='flex flex-col justify-center'>
    //         <button onClick={() => signOut(auth)} className='mx-auto'>
    //             SIGN OUT
    //         </button>
    //
    //         <form onSubmit={handleGameroomRouter}>
    //             <label htmlFor='gameroom-id-input'>Enter Gameroom ID</label>
    //             <input id='gameroom-id-input' name="gameroom-id-input" type='text' placeholder='Gameroom id...'/>
    //         </form>
    //     </div>
    // )
}