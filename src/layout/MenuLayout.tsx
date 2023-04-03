import {User} from "firebase/auth";
import {lazy, ReactNode} from "react";
import HeaderComponent from "./HeaderComponent";
const UserprofileDropdown = lazy(() => import("../components/authentication/UserprofileDropdown"))

type Props = {
    user: User
    children: ReactNode
}

export default function MenuLayout({ user, children }: Props) {
    return (
        <div className='flex flex-col px-2 bg-neutral-800 w-screen h-screen text-gray-300'>
            <HeaderComponent displaynameText={`Welcome ${user.displayName}`}>
                <UserprofileDropdown user={user}/>
            </HeaderComponent>

            <div className='border-b border-neutral-700 w-full py-1'/>
            <img src='/homepage-icon.svg' alt='home-icon' className='h-[30dvh] w-fit mx-auto py-3'/>

            { children }

            <div className='px-6'>
                <div className='bg-white/10 rounded-lg px-7 py-3 my-5 w-fit mx-auto text-gray-400 shadow-2xl break-all'>
                    <h3 className='text-center text-lg font-semibold text-gray-300 pb-2'>Game Instructions - Rummy</h3>

                    <ol className='list-inside list-decimal list-image-[url(list-marker.svg)]'>
                        <li>HELLO nnnnnnnnnnnnnnnnnbbbbbbbbbbbbbbbbbbbbbbbn</li>
                        <li>HELLO nnnnnnnnnnnn</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}