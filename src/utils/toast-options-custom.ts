import { ToastOptions } from "react-hot-toast";

export function toastOptionsCustom(options: ToastOptions, backgroundColor: string = 'bg-neutral-100'): ToastOptions {
    options.style = {
        border: '1px solid #000000',
        padding: '9px',
        color: 'black',
        backgroundColor
    }

    return options
}