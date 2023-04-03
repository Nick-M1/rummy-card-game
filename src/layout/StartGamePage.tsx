import HeaderComponent from "./HeaderComponent";
import UserprofileDropdown from "../components/authentication/UserprofileDropdown";
import {User} from "firebase/auth";
import MenuLayout from "./MenuLayout";
import {Link} from "react-router-dom";

type Props = {
    user: User
    text: string
    buttonText: string
    buttonHandler: () => Promise<void>
}

export default function StartGamePage({ user, text, buttonText, buttonHandler }: Props) {
    return (
        <MenuLayout user={user}>
            <h1 className='mx-auto w-fit py-3 text-2xl font-semibold tracking-wide'>
                { text }
            </h1>

            <div className='mx-auto w-fit pb-[2.6rem] md:pb-[3.1rem] grid grid-cols-3 space-x-2'>
                <Link to='/' className='btn-tertiary flex items-center h-12'>
                    Go Back
                </Link>

                <button onClick={buttonHandler} className='btn-primary col-span-2 flex justify-center items-center h-12'>
                    { buttonText }
                </button>
            </div>
        </MenuLayout>
    )
}