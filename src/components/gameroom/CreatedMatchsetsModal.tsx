import {Dispatch, SetStateAction} from "react";
import Card from "./Card";
import ModalCustom from "../shared/ModalCustom";
import {sortCardsFunction} from "../../utils/all-cards";

type Props = {
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>

    triplesCreated: { [p: string]: Card[] }
    canAddToTriples: boolean
    handler: (cards: Card[]) => void
}

export default function CreatedMatchsetsModal({ modalOpen, setModalOpen, triplesCreated, canAddToTriples, handler }: Props) {

    return (
        <ModalCustom title='Created Match-Sets' modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div>
                { Object.entries(triplesCreated)
                    .sort((a, b) => a[0].localeCompare(b[0]) )
                    .map(([tripleId, tripleCollection]) => (
                    <div key={tripleId} className='flex space-x-2 py-3 overflow-x-auto scrollbar'>
                        { tripleCollection.sort(sortCardsFunction).map(card => (
                            <div key={card.id} className='flex-shrink-0'>
                                <img src={card.img || undefined} alt='card' className='w-24'/>
                            </div>
                        ))}

                        { canAddToTriples &&
                            <div
                                onClick={() => handler(tripleCollection)}
                                className='flex-shrink-0 bg-white/10 w-24 rounded-md flex items-center justify-center text-4xl pb-4 hover:bg-white/20 smooth-transition cursor-pointer'
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