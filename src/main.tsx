import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import GameroomPage from './routes/GameroomPage'
import './index.css'
import ErrorPage from "./layout/ErrorPage";
import HomePage from "./routes/HomePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/:gameroomId",
        element: <GameroomPage/>,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
