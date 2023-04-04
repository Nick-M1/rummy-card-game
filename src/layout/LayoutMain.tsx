import {Navigate, Outlet, useOutletContext } from "react-router-dom";
import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import LoadingPage from "../pages/LoadingPage";
import {User} from "firebase/auth";
import {lazy} from "react";

const UserprofileDropdown = lazy(() => import("../components/authentication/UserprofileDropdown"));

type ContextType = {
    user: User
};

export default function LayoutMain() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined')
        return <Navigate to="/signin" replace={true}/>

    return (
        <div className='w-screen h-screen bg-neutral-800 text-gray-300 py-2'>
            <div className="flex items-center space-x-2 w-full py-2 px-2 md:px-4">
                <img src="/brand-logo.png" alt="logo" className="w-8"/>
                <h1 className="flex-grow text-xl md:text-2xl font-semibold">Rummy Card Game</h1>

                <h1 className="text-right">Welcome { user.displayName }</h1>
                <UserprofileDropdown user={user}/>
            </div>

            <Outlet context={{ user }}/>
        </div>
    )
}

export function useUser() {
    return useOutletContext<ContextType>()
}