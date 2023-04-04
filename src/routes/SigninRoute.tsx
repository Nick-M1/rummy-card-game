import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import LoadingPage from "../pages/LoadingPage";
import {Navigate} from "react-router-dom";
import SigninPage from "../components/authentication/SigninPage";

export function Component() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined')
        return <SigninPage/>

    return <Navigate to='/'/>
}