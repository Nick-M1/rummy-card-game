import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import MainGameComponent from "../components/gameroom/MainGameComponent";
import {Toaster} from "react-hot-toast";
import LoadingPage from "../layout/LoadingPage";
import {Navigate} from "react-router-dom";


// Change to 'export function Component()'
export default function GameroomPage() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined')
        return <Navigate to="/" />

    return (
        <>
            <Toaster/>
            <MainGameComponent user={user}/>
        </>
    )
}