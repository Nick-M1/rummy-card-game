import ActiveGamePage from "../pages/ActiveGamePage";
import {Toaster} from "react-hot-toast";
import {Navigate, useParams} from "react-router-dom";
import {useUser} from "../layout/LayoutMain";


export function Component() {
    const { gameroomId } = useParams()
    const { user } = useUser()

    if (typeof gameroomId == 'undefined')
        return <Navigate to="/" />

    return (
        <>
            <Toaster/>
            <ActiveGamePage user={user} gameroomId={gameroomId}/>
        </>
    )
}