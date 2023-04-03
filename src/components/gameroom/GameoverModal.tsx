import {Dispatch, SetStateAction} from "react";
import ModalCustom from "../shared/ModalCustom";

type Props = {
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>

    isWinner: boolean
    winnersDisplayname: string | null
}

export default function GameoverModal({ modalOpen, setModalOpen, isWinner, winnersDisplayname }: Props) {
    return (
        <ModalCustom title={isWinner ? 'YOU WON!' : 'YOU LOST!'} modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div className='flex flex-col justify-center text-gray-300'>
                <img src={isWinner ? '/gameover/winner.png' : '/gameover/loser.png'} alt='gameover' className='w-[40dvw] md:w-[30dvw] mx-auto'/>
                <h3 className='mx-auto text-2xl'>
                    { isWinner ? (
                        <>
                            🏆 Well done {' '}
                            <span className='font-semibold'>{winnersDisplayname}</span>
                            🏆
                        </>
                    ) : (
                        <>
                            😢 The winner is {' '}
                            <span className='font-semibold'>{winnersDisplayname}</span>
                            😢
                        </>
                    )}
                </h3>
            </div>
        </ModalCustom>
    )
}