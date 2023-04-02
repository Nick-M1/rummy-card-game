import {Dialog, Transition} from "@headlessui/react";
import {Dispatch, SetStateAction, Fragment} from "react";
import {XMarkIcon} from "@heroicons/react/20/solid";
import Card from "./Card";

type Props = {
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>

    triplesCreated: { [p: string]: Card[] }
    canAddToTriples: boolean
    handler: (cards: Card[]) => void
}

export default function CompletedTriplesModal({ modalOpen, setModalOpen, triplesCreated, canAddToTriples, handler }: Props) {

    return (
        <Transition appear show={modalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
                onClose={() => setModalOpen(false)}
            >
                <div className="min-h-screen-withmobile px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    <span
                        className="inline-block h-screen-withmobile align-middle"
                        aria-hidden="true"
                    >
                          &#8203;
                        </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-xl py-6 px-8 my-8 text-left align-middle transition-all transform bg-neutral-800 border border-neutral-700 shadow-xl rounded-xl">
                            <Dialog.Title
                                as="h3"
                                className="pb-3 text-2xl leading-6 text-white border-b border-gray-700 text-center"
                            >
                                Completed Triples
                                <div onClick={() => setModalOpen(false)} className='absolute p-1 right-6 top-5 bg-neutral-700/75 hover:bg-neutral-700 active:bg-neutral-600/95 rounded-full cursor-pointer smooth-transition'>
                                    <XMarkIcon className='w-6 w-6'/>
                                </div>
                            </Dialog.Title>

                            <div>
                                { Object.entries(triplesCreated).map(([tripleId, tripleCollection]) => (
                                    <div key={tripleId} className='flex space-x-2 py-3 flex-shrink-0'>
                                        <>
                                            { tripleCollection.map(card => (
                                                <div key={card.id}>
                                                    <img src={card.img || undefined} alt='card' className='h-40 flex-shrink-0'/>
                                                </div>
                                            ))}

                                            { canAddToTriples &&
                                                <div
                                                    onClick={() => handler(tripleCollection)}
                                                    className='bg-white/10 h-40 w-28 rounded-md flex items-center justify-center text-4xl pb-4 hover:bg-white/20 smooth-transition cursor-pointer'
                                                >
                                                    +
                                                </div>
                                            }
                                        </>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}