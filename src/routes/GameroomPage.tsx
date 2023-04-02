import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import MainGameComponent from "../components/gameroom/MainGameComponent";
import {Toaster} from "react-hot-toast";
import LoadingPage from "../components/LoadingPage";


export default function GameroomPage() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <LoadingPage/>

    if (user == null || typeof userError != 'undefined') {
        return (
            // <Navigate
            //     replace={true}
            //     to="/login"
            //     state={{ from: `${location.pathname}${location.search}` }}
            // />
            <div>NOT SIGNED IN</div>
        )
    }

    return (
        <>
            <Toaster/>
            <MainGameComponent user={user}/>
        </>
    )
}