import {ALL_CARDS} from "../../utils/all-cards";
import Card from "./Card";
import {useEffect, useState} from "react";
import shuffleArray from "../../utils/shuffle-array";
import {db} from "../../firebase";
import { onSnapshot, query, collection, setDoc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, doc, increment } from "@firebase/firestore"
import {User} from "firebase/auth";
import {useLocation} from "react-router-dom";
import PlayerHand from "./PlayerHand";
import {BeatLoader} from "react-spinners";
import CompletedTriplesModal from "./CompletedTriplesModal";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../../utils/toast-options-custom";
import HeaderComponent from "../HeaderComponent";


const STARTING_CARD_NUMBER = 10

enum SelectorModeEnum {
    NONE,
    TRIPLE_SELECTOR,
    COMPLETE_OTHER_TRIPLE,
    DISCARD_CARD
}

type Props = {
    user: User
}



export default function MainGameComponent({ user }: Props) {
    const gameroomId = useLocation().pathname.slice(1)

    const [selectorMode, setSelectorMode] = useState<SelectorModeEnum>(SelectorModeEnum.NONE)
    useEffect(() => {
        switch (selectorMode) {
            case SelectorModeEnum.NONE:
                toast.dismiss('selector-mode')
                break;

            case SelectorModeEnum.TRIPLE_SELECTOR:
                toast('Select at least 3 cards from your hand and test for a triple', { ...toastOptionsCustom, id: 'selector-mode', duration: 100_000 })
                break;

            case SelectorModeEnum.COMPLETE_OTHER_TRIPLE:
                toast('Select a card from your hand and attempt to add to the already created triples', { ...toastOptionsCustom, id: 'selector-mode', duration: 100_000 })
                break;

            case SelectorModeEnum.DISCARD_CARD:
                toast('Select a card from your hand to discard (this will end your turn)', { ...toastOptionsCustom, id: 'selector-mode', duration: 100_000 })
                break;
        }
    }, [selectorMode])

    const [selectTripleList, setSelectTripleList] = useState<Card[]>([])

    const [completedTriplesModalOpen, setCompletedTriplesModalOpen] = useState(false)
    const [completedTripleHolder, setCompletedTripleHolder] = useState<Card[]>([])

    const [gamestate, setGamestate] = useState<GameType>()

    // FILTER FOR CHATS
    useEffect(() => {
        const chatroomUnsub = onSnapshot(
            doc(db, "games", gameroomId),
            (doc) => {
                const docData = doc.data() as GameType | undefined
                if (docData != undefined) {
                    setGamestate(docData as GameType)
                }
            });

        return () => chatroomUnsub()
    }, [])


    const startGameHandler = async () => {
        const shuffledCards = shuffleArray(ALL_CARDS)
        const player1Cards = shuffledCards.splice(0, STARTING_CARD_NUMBER)

        await setDoc(doc(db, "games", gameroomId), {
            numberOfPlayers: 1,
            round: 0,
            cardPickedUpThisRound: false,

            newCardsPile: shuffledCards,
            discardPile: [],
            triplesCreated: [],

            playerInfo: {
                [user.uid]: {
                    index: 0,
                    displayName: user.displayName,
                    displayImage: user.photoURL
                },
            },

            playerHands: {
                [user.uid]: player1Cards,
            },

            playerHasTriple: {
                [user.uid]: false,
            },
        })
    }


    if (typeof gamestate == 'undefined')
        return (
            <div>
                <h1>GAME NOT CREATED YET</h1>

                <button onClick={startGameHandler}>
                    | START GAME |
                </button>
            </div>
        )

    const joinGameHandler = async () => {
        const playerCards = gamestate.newCardsPile.splice(0, STARTING_CARD_NUMBER)

        await updateDoc(doc(db, "games", gameroomId), {
            numberOfPlayers: increment(1),
            [`playerInfo.${user.uid}`]: {
                index: gamestate.numberOfPlayers,
                displayName: user.displayName,
                displayImage: user.photoURL
            },
            [`playerHands.${user.uid}`]: playerCards,
            [`playerHasTriple.${user.uid}`]: false,
        })

        for (const card of playerCards) {
            await updateDoc(doc(db, "games", gameroomId), {
                newCardsPile: arrayRemove(card),
            })
        }
    }

    if (!gamestate.playerHands.hasOwnProperty(user.uid))
        return (
            <button onClick={joinGameHandler}>
                | JOIN GAME |
            </button>
        )


    const currentRound = gamestate.round % gamestate.numberOfPlayers


    const takeCardFromNewPileHandler = async () => {
        const newCard = gamestate.newCardsPile.at(0)

        await updateDoc(doc(db, "games", gameroomId), {
            cardPickedUpThisRound: true,
            newCardsPile: arrayRemove(newCard),
            [`playerHands.${user.uid}`]: arrayUnion(newCard),
        })
    }

    const takeCardFromDiscardPileHandler = async () => {
        const newCard = gamestate.discardPile.at(-1)

        await updateDoc(doc(db, "games", gameroomId), {
            cardPickedUpThisRound: true,
            discardPile: arrayRemove(newCard),
            [`playerHands.${user.uid}`]: arrayUnion(newCard),
        })
    }

    const addCardToDiscardPileHandler = async (card: Card) => {
        await updateDoc(doc(db, "games", gameroomId), {
            round: increment(1),
            cardPickedUpThisRound: false,
            [`playerHands.${user.uid}`]: arrayRemove(card),
            discardPile: arrayUnion(card),
        })

        setSelectorMode(SelectorModeEnum.NONE)
        setSelectTripleList([])
    }

    const checkTriplesBySameSuite = (cards: Card[], suite: string): boolean => {
        for (const [index, card] of cards.entries()) {
            if (!(card.suite === suite && (index==0 || card.ranking-1 === cards[index-1].ranking)))
                return false
        }
        return true
    }

    const checkTriplesBySameRank = (cards: Card[], rank: number): boolean => {
        const seenSuites = new Set<string>()

        for (const card of cards) {
            if (card.ranking !== rank || seenSuites.has(card.suite))
                return false
            seenSuites.add(card.suite)
        }
        return true
    }

    const checkTriples = (cards: Card[]): boolean => {
        if (cards.length < 3)
            return false

        const sortedCards = cards.sort((c1, c2) => c1.ranking - c2.ranking)
        const firstSuite = cards[0].suite
        const firstRank = cards[0].ranking

        // Check suites match or rank match
        return checkTriplesBySameSuite(sortedCards, firstSuite) || checkTriplesBySameRank(sortedCards, firstRank)
    }

    const removeTriple = async () => {
        if (!checkTriples(selectTripleList))
            return

        for (const card of selectTripleList) {
            await updateDoc(doc(db, "games", gameroomId), {
                [`playerHands.${user.uid}`]: arrayRemove(card),
                [`playerHasTriple.${user.uid}`]: true,
            })
        }

        const sortedTriple = selectTripleList.sort((a, b) => a.ranking - b.ranking)
        await updateDoc(doc(db, "games", gameroomId), {
            [`triplesCreated.${sortedTriple[0].id}`]: sortedTriple
        })
    }

    const selectTripleHandler = (card: Card) => {
        setSelectTripleList(prevState => {
            const indexFound = prevState.map(c => c.id).indexOf(card.id)

            if (indexFound == -1)
                return [...prevState, card]

            const tmp = [...prevState]
            tmp.splice(indexFound, 1)
            return tmp

        })
    }

    const completeAlreadyCreatedTriple = async (card: Card) => {
        if (!checkTriples([...completedTripleHolder, card]))
            return

        await updateDoc(doc(db, "games", gameroomId), {
            [`playerHands.${user.uid}`]: arrayRemove(card),
        })

        await updateDoc(doc(db, "games", gameroomId), {
            [`triplesCreated.${completedTripleHolder[0].id}`]: arrayUnion(card)
        })
    }

    const cardOnclickHandler = (card: Card) => {
        switch (selectorMode) {
            case SelectorModeEnum.NONE:
                break

            case SelectorModeEnum.TRIPLE_SELECTOR:
                selectTripleHandler(card)
                break;

            case SelectorModeEnum.COMPLETE_OTHER_TRIPLE:
                completeAlreadyCreatedTriple(card)
                break;

            case SelectorModeEnum.DISCARD_CARD:
                addCardToDiscardPileHandler(card)
                break;
        }
    }

    return (
        <>
            <div className='px-2 bg-neutral-800 w-screen h-screen text-gray-300'>
                <HeaderComponent displaynameText={`You are Player ${gamestate.playerInfo[user.uid].index}`}>
                    <img src={user.photoURL || '/unknown-profilepic.png'} alt="profile" className="w-8 rounded-full"/>
                </HeaderComponent>

                <div className='flex justify-between space-x-5 py-2 border-b border-neutral-600'>
                    {Object.values(gamestate.playerInfo)
                        .sort((p1, p2) => p1.index - p2.index)
                        .map(playerInfo => (
                            <div key={playerInfo.index}
                                 className={`flex space-x-2 flex-grow rounded-md p-3 m-0.5 shadow-sm text-sm outline smooth-transition ${currentRound === playerInfo.index ? 'outline-3 outline-teal-600 bg-white/20 text-gray-100' : 'outline-1 outline-gray-600 bg-white/10 text-gray-300'}`}>
                                <img src={playerInfo.displayImage || undefined} alt='profile'
                                     className='w-10 h-10 rounded-full'/>
                                <p>
                                    <span className='italic'>Player {playerInfo.index}</span>
                                    <br/>
                                    {playerInfo.displayName}
                                </p>
                            </div>
                        ))}
                </div>

                {currentRound === gamestate.playerInfo[user.uid].index
                    ? (
                        <>
                            {/*<button onClick={startGameHandler}>*/}
                            {/*    | START GAME |*/}
                            {/*</button>*/}
                            {/*<br/>*/}

                            <button onClick={() => setCompletedTriplesModalOpen(true)}>
                                | OPEN TRIPLES MODAL |
                            </button>
                            <br/>

                            <h3 className='pt-2'>Your turn...</h3>

                            {gamestate.cardPickedUpThisRound
                                ? (
                                    <>
                                        <div className='pt-1 pb-4 grid grid-cols-3 gap-5 border-b border-neutral-600'>
                                            <button onClick={() => setSelectorMode(SelectorModeEnum.TRIPLE_SELECTOR)}
                                                    className={`btn-secondary ${selectorMode == SelectorModeEnum.TRIPLE_SELECTOR && 'outline outline-4 outline-teal-600'}`}>
                                                Select a triple
                                            </button>
                                            <button onClick={() => setCompletedTriplesModalOpen(true)}
                                                    className={`btn-secondary ${selectorMode == SelectorModeEnum.COMPLETE_OTHER_TRIPLE && 'outline outline-4 outline-teal-600'}`}>
                                                Complete an already completed triple
                                            </button>
                                            <button onClick={() => setSelectorMode(SelectorModeEnum.DISCARD_CARD)}
                                                    className={`btn-secondary ${selectorMode == SelectorModeEnum.DISCARD_CARD && 'outline outline-4 outline-teal-600'}`}>
                                                Discard a card
                                            </button>
                                        </div>

                                        <br/>
                                        <button onClick={() => removeTriple()}>
                                            | CHECK SELECTED TRIPLES |
                                        </button>
                                    </>
                                ) : (
                                    <div className='pt-1 pb-4 grid grid-cols-2 gap-5 border-b border-neutral-600'>
                                        <button onClick={takeCardFromNewPileHandler} className='btn-primary'>
                                            Take a new card from the unseen cards pile
                                        </button>

                                        {gamestate.discardPile.length != 0 && (
                                            <button onClick={takeCardFromDiscardPileHandler} className='btn-primary'>
                                                Take a card from the discard pile
                                            </button>
                                        )}
                                    </div>
                                )}
                        </>

                    ) : (
                        <div className='pt-8 flex flex-col justify-center items-center text-3xl'>
                            Player {currentRound}'s turn
                            <BeatLoader color='teal' size='30' className='py-5'/>
                        </div>
                    )
                }

                {/* DISCARD PILE */}
                <div className='absolute right-2 bottom-52 rounded-md border-t border-l border-neutral-600 p-1.5'>
                    <h3 className='pb-1.5'>Discard Pile</h3>
                    <img src={gamestate.discardPile.at(-1)?.img || '/cards-back/red.svg'} alt='discard pile'
                         className='h-40 flex-shrink-0'/>
                </div>

                {/* PLAYER'S HAND */}
                <div className='fixed bottom-0 border-t border-neutral-600 w-full pr-2 pb-1'>
                    <h3 className='py-1'>Your hand</h3>
                    <PlayerHand
                        cards={gamestate?.playerHands[user.uid].sort((c1, c2) => c1.ranking - c2.ranking)}
                        selectTripleListIds={selectTripleList.map(c => c.id)}
                        cardOnclickHandler={cardOnclickHandler}
                    />
                </div>
            </div>

            <CompletedTriplesModal
                modalOpen={completedTriplesModalOpen}
                setModalOpen={setCompletedTriplesModalOpen}
                triplesCreated={gamestate.triplesCreated}

                canAddToTriples={currentRound === gamestate.playerInfo[user.uid].index && gamestate.cardPickedUpThisRound}
                handler={(cards: Card[]) => {
                    setCompletedTripleHolder(cards)
                    setSelectorMode(SelectorModeEnum.COMPLETE_OTHER_TRIPLE)
                    setCompletedTriplesModalOpen(false)
                }}
            />
        </>
    )
}