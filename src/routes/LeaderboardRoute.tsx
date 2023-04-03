import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import LoadingPage from "../layout/LoadingPage";
import {Navigate, useParams} from "react-router-dom";
import LeaderboardPage from "../components/leaderboard/LeaderboardPage";

export default function LeaderboardRoute() {
    const [user, userLoading, userError] = useAuthState(auth)
    const { gameroomId } = useParams()

    if (userLoading || typeof gameroomId == 'undefined')
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined')
        return <Navigate to="/" />

    return <LeaderboardPage user={user} gameroomId={gameroomId} />
}