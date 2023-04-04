import useAuthState from "../hooks/useAuthState";
import {auth} from "../firebase";
import LoadingPage from "../layout/LoadingPage";
import {Navigate, useLoaderData} from "react-router-dom";
import LeaderboardPage from "../components/leaderboard/LeaderboardPage";
import {LoaderOutputType} from "../loaders/leaderboard-route";

export function Component() {
    const { gameroomId, results } = useLoaderData() as LoaderOutputType
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading || typeof gameroomId == 'undefined')
        return <LoadingPage/>
    if (user == null || typeof userError != 'undefined' || typeof results == 'undefined')
        return <Navigate to="/" />

    return <LeaderboardPage user={user} gameroomId={gameroomId} resultsData={results} />
}