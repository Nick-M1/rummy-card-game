import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import MainGameComponent from "../components/gameroom/MainGameComponent";
import {Toaster} from "react-hot-toast";
import LoadingPage from "../layout/LoadingPage";
import {Navigate, useParams} from "react-router-dom";


// Change to 'export function Component()'
export function Component() {
    const [user, userLoading, userError] = useAuthState(auth)
    const { gameroomId } = useParams()

    if (userLoading || typeof gameroomId == 'undefined')
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined')
        return <Navigate to="/" />

    return (
        <>
            <Toaster/>
            <MainGameComponent user={user} gameroomId={gameroomId}/>
        </>
    )
}