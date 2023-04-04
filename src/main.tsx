import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from "./layout/ErrorPage";
import {leaderboardLoader} from "./loaders/leaderboard-route";
import BlankPage from "./layout/BlankPage";


const router = createBrowserRouter(
    createRoutesFromElements(

        <Route element={<BlankPage/>} errorElement={<ErrorPage/>}>
            <Route index lazy={() => import("./routes/HomePage")}/>
            <Route path='/:gameroomId' lazy={() => import("./routes/GameroomPage")}/>
            <Route path='/:gameroomId/leaderboard' lazy={() => import("./routes/LeaderboardRoute")} loader={leaderboardLoader}/>
        </Route>

    )
)


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
