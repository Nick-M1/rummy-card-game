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
                    <div key={tripleId} className='flex space-x-2 py-3 overflow-x-auto scrollbar'>
                        { tripleCollection.map(card => (
                            <div key={card.id} className='flex-shrink-0'>
                                <img src={card.img || undefined} alt='card' className='w-24'/>
                            </div>
                        ))}

                        { canAddToTriples &&
                            <div
                                onClick={() => handler(tripleCollection)}
                                className='bg-white/10 w-24 rounded-md flex items-center justify-center text-4xl pb-4 hover:bg-white/20 smooth-transition cursor-pointer'
                            >
                                +
                            </div>
                        }
                    </div>
                ))}
            </div>
        </ModalCustom>
    );
}