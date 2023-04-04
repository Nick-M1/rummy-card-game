import toast from "react-hot-toast";
import {ReactNode} from "react";

export const customToast = (id: string, children: ReactNode, duration = 4000) => {
    toast.custom((t) => (
        <div className={`bg-neutral-100 px-6 py-4 shadow-3xl drop-shadow-2xl rounded-xl text-black ${ t.visible ? 'animate-enter' : 'animate-leave' }`} >
            { children }
        </div>
    ),{ id, duration });
}