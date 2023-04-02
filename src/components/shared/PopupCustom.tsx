import {Dispatch, ForwardRefExoticComponent, Fragment, SetStateAction, SVGProps, useRef} from "react";
import {Dialog, Transition} from "@headlessui/react";
import * as React from "react";

type Props = {
    modal: boolean
    setModal: Dispatch<SetStateAction<boolean>>
    confirmHandler: () => Promise<void>

    titleText: string
    descriptionText: string
    buttonText: string

    IconImg: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>
}

export default function PopupCustom({ modal, setModal, confirmHandler, titleText, descriptionText, buttonText, IconImg }: Props) {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={modal} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-30 inset-0 overflow-y-auto backdrop-blur-sm"
                initialFocus={cancelButtonRef}
                onClose={setModal}
            >
                <div className="flex items-center justify-center min-h-screen-withmobile pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"/>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen-withmobile align-middle"
                        aria-hidden="true"
                    >
                          &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            className="inline-block align-bottom backdrop-blur-sm bg-neutral-800 border border-neutral-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-neutral-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div
                                        className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <IconImg
                                            className="h-6 w-6 text-red-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-white"
                                        >
                                            {titleText}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-300">
                                                {descriptionText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-neutral-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm smooth-transition"
                                    onClick={() => {
                                        confirmHandler()
                                        setModal(false)
                                    }}
                                >
                                    {buttonText}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm smooth-transition "
                                    onClick={() => setModal(false)}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}