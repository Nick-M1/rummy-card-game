import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from "./pages/ErrorPage";
import {leaderboardLoader} from "./loaders/leaderboard-route";
import LayoutMain from "./layout/LayoutMain";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path='/signin' lazy={() => import("./routes/SigninRoute")}/>

            <Route element={<LayoutMain/>} errorElement={<ErrorPage/>}>
                <Route index lazy={() => import("./routes/HomePage")}/>
                <Route path='/profileId' lazy={() => import("./routes/ProfileRoute")}/>

                <Route path='/:gameroomId' lazy={() => import("./routes/GameroomPage")}/>
                <Route path='/:gameroomId/leaderboard' lazy={() => import("./routes/LeaderboardRoute")} loader={leaderboardLoader}/>
            </Route>
        </Route>
    )
)


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
