import {Dispatch, SetStateAction} from "react";
import Card from "./Card";
import ModalCustom from "../shared/ModalCustom";

type Props = {
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>

    triplesCreated: { [p: string]: Card[] }
    canAddToTriples: boolean
    handler: (cards: Card[]) => void
}

export default function CompletedTriplesModal({ modalOpen, setModalOpen, triplesCreated, canAddToTriples, handler }: Props) {

    return (
        <ModalCustom title='Completed Triples' modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div>
                { Object.entries(triplesCreated).map(([tripleId, tripleCollection]) => (
                    <div key={tripleId} className='flex space-x-2 py-3 flex-shrink-0 overflow-y-auto scrollbar'>
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
        </ModalCustom>
    );
}