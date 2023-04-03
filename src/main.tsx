import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'
import ErrorPage from "./layout/ErrorPage";
import BlankPage from "./layout/BlankPage";

const HomePage = lazy(() => import("./routes/HomePage"))
const GameroomPage = lazy(() => import("./routes/GameroomPage"))
const LeaderboardRoute = lazy(() => import("./routes/LeaderboardRoute"))


function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<BlankPage/>}>
                <Routes>
                    <Route path='/' element={<HomePage/>} errorElement={<ErrorPage/>}/>
                    <Route path='/:gameroomId' element={<GameroomPage/>} errorElement={<ErrorPage/>}/>
                    <Route path='/:gameroomId/leaderboard' element={<LeaderboardRoute/>} errorElement={<ErrorPage/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
