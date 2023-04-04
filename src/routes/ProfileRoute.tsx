import {Navigate, useLoaderData} from "react-router-dom";
import LeaderboardPage from "../pages/LeaderboardPage";
import {LoaderOutputType} from "../loaders/leaderboard-route";
import {useUser} from "../layout/LayoutMain";

export function Component() {
    const { gameroomId, results } = useLoaderData() as LoaderOutputType
    const { user } = useUser()

    if (typeof results == 'undefined')
        return <Navigate to={`/${gameroomId}`} />

    return <LeaderboardPage user={user} gameroomId={gameroomId} resultsData={results} />
}