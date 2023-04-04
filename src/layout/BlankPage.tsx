import {Outlet} from "react-router-dom";

export default function BlankPage() {
    return (
        <div className='w-screen h-screen bg-neutral-800'>
            <Outlet/>
        </div>
    )
}