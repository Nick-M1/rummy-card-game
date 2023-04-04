import {signOut, User} from "firebase/auth";
import {classNames} from "../../utils/textUtils";
import {Fragment, useState} from "react";
import {ArrowRightOnRectangleIcon, UserIcon} from "@heroicons/react/24/outline";
import {auth} from "../../firebase";
import {Menu, Transition} from "@headlessui/react";
import PopupCustom from "../shared/PopupCustom";
import {Link} from "react-router-dom";

function menuitemClassname({ active, disabled }: { active: boolean, disabled: boolean }) {
    return classNames(
        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
        disabled ? 'cursor-not-allowed opacity-50' : '',
        "block w-full text-left py-2 px-4 text-sm smooth-transition"
    )
}



type Props = {
    user: User
}

export default function UserprofileDropdown({ user }: Props) {
    const [logoutPopup , setLogoutPopup] = useState(false)
    const userNavigation = [
        { isButton: false, name: "My Profile",  to: `#`,                                 icon: UserIcon },
        { isButton: true,  name: "Logout",      func: () => setLogoutPopup(true),  icon: ArrowRightOnRectangleIcon },
    ];

    return (
        <>
            <Menu as="div" className="flex-shrink-0 relative ml-5 ml-auto">
                <div>
                    <Menu.Button
                        className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-400 hover:ring-1 hover:ring-offset-1 hover:ring-offset-blue-300 smooth-transition">
                        <img
                            src={ user && user.photoURL != null ? user.photoURL : "/unknown-profilepic.png" }
                            alt="chatCube"
                            width={35}
                            height={35}
                            className="rounded-full"
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="smooth-transition origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 pb-2 pt-3 focus:outline-none">

                        <Menu.Item>
                            <div className="px-4 pb-2 border-b border-gray-100">
                                <p className="text-sm leading-5 text-gray-700 text-left">Signed in as</p>
                                <p className="truncate text-sm font-medium leading-5 text-gray-900 font-semibold text-left">{ user.email }</p>
                            </div>
                        </Menu.Item>

                        { userNavigation.map(item => (
                            <Menu.Item key={item.name}>
                                {( itemrenderPropArgs) => (
                                    item.isButton ? (
                                        <button
                                            type='button'
                                            onClick={item.func}
                                            className={`${menuitemClassname(itemrenderPropArgs)} flex`}
                                        >
                                            <item.icon className='h-5 w-5 mr-2.5'/>
                                            <span>{item.name}</span>
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.to!}
                                            className={`${menuitemClassname(itemrenderPropArgs)} flex`}
                                        >
                                            <item.icon className='h-5 w-5 mr-2.5'/>
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>

            <PopupCustom
                modal={logoutPopup}
                setModal={setLogoutPopup}
                confirmHandler={() => signOut(auth)}

                titleText={'Logging out'}
                descriptionText={'Are you sure you want to log out ?'}
                buttonText={'Logout'}

                IconImg={ArrowRightOnRectangleIcon}
            />
        </>
    );
}