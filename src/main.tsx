import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from "./layout/ErrorPage";
import LoadingPage from "./layout/LoadingPage";
import BlankPage from "./layout/BlankPage";
import FallbackProvider from "./composables/FallbackProvider";

const HomePage = lazy(() => import("./routes/HomePage"))
const GameroomPage = lazy(() => import("./routes/GameroomPage"))

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <FallbackProvider>
                <HomePage/>
            </FallbackProvider>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/:gameroomId",
        element: (
            <FallbackProvider>
                <GameroomPage/>
            </FallbackProvider>
        ),
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
