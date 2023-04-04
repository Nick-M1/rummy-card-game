import {ALL_CARDS} from "../utils/all-cards";
import Card from "../components/gameroom/Card";
import {useEffect, useState} from "react";
import shuffleArray from "../utils/shuffle-array";
import {db} from "../firebase";
import { onSnapshot, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, doc, increment } from "@firebase/firestore"
import {User} from "firebase/auth";
import PlayerHand from "../components/gameroom/PlayerHand";
import {BeatLoader} from "react-spinners";
import CompletedTriplesModal from "../components/gameroom/CompletedTriplesModal";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../utils/toast-options-custom";
import StartGamePage from "./StartGamePage";
import GameoverModal from "../components/gameroom/GameoverModal";
import {smoothScrollWithHighlight} from "../utils/smooth-scroll";
import {customToast} from "../utils/custom-toasts/toast-with-images";


const toastWithCards = (id: string, text: string, icon: string, images: string[], isValid: boolean, submitHandler: () => void) => {
    const children = (
        <div className='flex space-x-2'>
            <div>{ icon }</div>
            <div>
                { text }
                <div className='flex pt-2 space-x-2 items-center'>
                    { images.map((image, index) =>
                        <img key={index} src={image} alt={image} className='w-16 border border-black/50 rounded-sm'/>
                    )}
                    { images.length != 0 &&
                        <>
                            <img src={ isValid ? '/shared-icons/valid-icon.svg' : '/shared-icons/invalid-icon.svg' } alt='checker' className='w-6 h-6'/>
                            <div className='flex-grow'/>
                            <button onClick={submitHandler} className={`ml-auto btn-secondary ${!isValid && 'hidden'}`}>Submit Triple</button>
                        </>
                    }
                </div>
            </div>
        </div>
    )

    return customToast(id, children, 100_000)
}


const STARTING_CARD_NUMBER = 10

enum SelectorModeEnum {
    NONE,
    TRIPLE_SELECTOR,
    COMPLETE_OTHER_TRIPLE,
    DISCARD_CARD
}

type Props = {
    user: User
    gameroomId: string
}

export default function ActiveGamePage({ user, gameroomId }: Props) {

    const [selectorMode, setSelectorMode] = useState<SelectorModeEnum>(SelectorModeEnum.NONE)

    const [selectTripleList, setSelectTripleList] = useState<Card[]>([])

    const [completedTriplesModalOpen, setCompletedTriplesModalOpen] = useState(false)
    const [completedTripleHolder, setCompletedTripleHolder] = useState<Card[]>([])

    const [gamestate, setGamestate] = useState<GameDBType>()
    const [gameoverPopup, setGameoverPopup] = useState(false)

    useEffect(() => {
        switch (selectorMode) {
            case SelectorModeEnum.NONE:
                toast.dismiss('selector-mode')
                break;

            case SelectorModeEnum.TRIPLE_SELECTOR:
                toastWithCards('selector-mode', 'Select at least 3 cards from your hand and test for a triple', '🤷‍♀️', selectTripleList.map(c => c.img), checkTriples(selectTripleList), () => removeTriple())
                break;

            case SelectorModeEnum.COMPLETE_OTHER_TRIPLE:
                toastWithCards('selector-mode', 'Select a card from your hand and attempt to add to the already created triple', '🤷‍♀️', completedTripleHolder.map(c => c.img), checkTriples(selectTripleList), () => {})
                break;

            case SelectorModeEnum.DISCARD_CARD:
                toast('Select a card from your hand to discard (this will end your turn)', { ...toastOptionsCustom, icon: '🤷‍♀️', id: 'selector-mode', duration: 100_000 })
                break;
        }
    }, [selectorMode, selectTripleList, completedTripleHolder])

    useEffect(() => {
        const chatroomUnsub = onSnapshot(
            doc(db, "games", gameroomId),
            (doc) => {
                const docData = doc.data() as GameDBType | undefined
                if (docData != undefined) {
                    setGamestate(docData as GameDBType)
                }
            });

        return () => chatroomUnsub()
    }, [])

    const winnerCheck = async (userId: string, hand: Card[], playerHands: {[p: string]: Card[]}) => {
        if (hand.length != 0)
            return

        await updateDoc(doc(db, "games", gameroomId), {
            winner: userId
        })

        for (const [playerId, playerHand] of Object.entries(playerHands)) {
            await updateDoc(doc(db, "results", gameroomId), {
                [`rounds.${playerId}`]: arrayUnion( playerHand.map(c => c.ranking).reduce((num1, num2) => num1 + num2, 0) )
            })
        }
    }

    useEffect(() => {
        if (typeof gamestate != 'undefined') {
            if (gamestate.winner == null)
                winnerCheck(user.uid, gamestate.playerHands[user.uid], gamestate.playerHands)
            else
                setGameoverPopup(true)
        }

    }, [gamestate])


    const startGameHandler = async () => {
        const shuffledCards = shuffleArray(ALL_CARDS)
        const player1Cards = shuffledCards.splice(0, STARTING_CARD_NUMBER)

        await setDoc(doc(db, "games", gameroomId), {
            numberOfPlayers: 1,
            round: 0,
            cardPickedUpThisRound: false,
            winner: null,

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

        const resultsDbExists = await getDoc(doc(db, "results", gameroomId)).then(res => res.exists())
        if (!resultsDbExists) {
            await setDoc(doc(db, "results", gameroomId), {
                playerInfo: {
                    [user.uid]: {
                        index: 0,
                        displayName: user.displayName,
                        displayImage: user.photoURL
                    },
                },

                rounds: {
                    [user.uid]: []
                }
            })
        }

        await updateDoc(doc(db, "users", user.uid), {
            games: arrayUnion(gameroomId)
        })

    }


    if (typeof gamestate == 'undefined')
        return <StartGamePage text='Game not started yet' buttonText='Start Game' buttonHandler={startGameHandler}/>


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

        await updateDoc(doc(db, "results", gameroomId), {
            [`playerInfo.${user.uid}`]: {
                index: gamestate.numberOfPlayers,
                displayName: user.displayName,
                displayImage: user.photoURL
            },
            [`rounds.${user.uid}`]: [],
        })

        await updateDoc(doc(db, "users", user.uid), {
            games: arrayUnion(gameroomId)
        })
    }

    if (!gamestate.playerHands.hasOwnProperty(user.uid))
        return <StartGamePage text='Would you like to join this game' buttonText='Join Game' buttonHandler={joinGameHandler}/>

    const currentRound = gamestate.round % gamestate.numberOfPlayers
    const hasATripleAlready = gamestate.playerHasTriple[user.uid]

    const takeCardFromNewPileHandler = async () => {
        const newCard = gamestate.newCardsPile.at(0)

        await updateDoc(doc(db, "games", gameroomId), {
            cardPickedUpThisRound: true,
            newCardsPile: arrayRemove(newCard),
            [`playerHands.${user.uid}`]: arrayUnion(newCard),
        })

        smoothScrollWithHighlight(`hand-${newCard?.id}`, 'center')
        toast(`You picked up "${newCard?.name.toUpperCase()}"`, { ...toastOptionsCustom, icon: '⬆️', id: 'new-card' })
    }

    const takeCardFromDiscardPileHandler = async () => {
        const newCard = gamestate.discardPile.at(-1)

        await updateDoc(doc(db, "games", gameroomId), {
            cardPickedUpThisRound: true,
            discardPile: arrayRemove(newCard),
            [`playerHands.${user.uid}`]: arrayUnion(newCard),
        })

        smoothScrollWithHighlight(`hand-${newCard?.id}`, 'center')
        toast(`You picked up "${newCard?.name.toUpperCase()}"`, { ...toastOptionsCustom, icon: '⬆️', id: 'new-card' })
    }

    const addCardToDiscardPileHandler = async (card: Card) => {
        await updateDoc(doc(db, "games", gameroomId), {
            round: increment(1),
            cardPickedUpThisRound: false,
            [`playerHands.${user.uid}`]: arrayRemove(card),
            discardPile: arrayUnion(card),
        })

        toast(`You discarded "${card.name.toUpperCase()}"`, { ...toastOptionsCustom, icon: '⬇️', id: 'new-card' })
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

        setSelectTripleList([])
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
            <div className='px-2 text-gray-300'>

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
                            <h3 className='py-2'>Your turn...</h3>

                            {gamestate.cardPickedUpThisRound
                                ? (
                                    <>
                                        <div className='px-1 pt-1 pb-4 grid grid-cols-3 gap-5 border-b border-neutral-600'>
                                            <button onClick={() => setSelectorMode(SelectorModeEnum.TRIPLE_SELECTOR)}
                                                    className={`button-cyan ${selectorMode == SelectorModeEnum.TRIPLE_SELECTOR && '-translate-y-3'}`}>
                                                Select a triple
                                            </button>
                                            <button onClick={() => setCompletedTriplesModalOpen(true)}
                                                    className={`button-pink ${selectorMode == SelectorModeEnum.COMPLETE_OTHER_TRIPLE && '-translate-y-3'} ${!hasATripleAlready && 'cursor-not-allowed'}`}
                                                    disabled={!hasATripleAlready}>
                                                Complete an already completed triple
                                            </button>
                                            <button onClick={() => setSelectorMode(SelectorModeEnum.DISCARD_CARD)}
                                                    className={`button-yellow ${selectorMode == SelectorModeEnum.DISCARD_CARD && '-translate-y-3'}`}>
                                                Discard a card
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className='px-1 pt-1 pb-4 grid grid-cols-2 gap-5 border-b border-neutral-600'>
                                        <button onClick={takeCardFromNewPileHandler} className='button-lime'>
                                            Take a new card from the unseen cards pile
                                        </button>

                                        { gamestate.discardPile.length != 0 && (
                                            <button onClick={takeCardFromDiscardPileHandler} className='button-orange'>
                                                Take a card from the discard pile
                                            </button>
                                        )}
                                    </div>
                                )}
                        </>

                    ) : (
                        <div className='pt-8 flex flex-col justify-center items-center text-3xl'>
                            Player {currentRound}'s turn
                            <BeatLoader color='teal' size='30px' className='py-5'/>
                        </div>
                    )
                }

                {/* Triples Modal button */}
                <button onClick={() => setCompletedTriplesModalOpen(true)} className={`absolute bottom-52 left-2 button-white ${Object.values(gamestate.triplesCreated).length == 0 && 'hidden'}`}>
                    View Completed Triples
                </button>

                {/* DISCARD PILE */}
                <div className='absolute right-2 bottom-[13.3rem] rounded-md border-l border-neutral-600 p-2'>
                    <h3 className='pb-1.5 text-sm'>Discard Pile</h3>
                    <img src={gamestate.discardPile.at(-1)?.img || '/cards-back/red.svg'} alt='discard pile'
                         className='h-32 flex-shrink-0'/>
                </div>

                {/* PLAYER'S HAND */}
                <div className='fixed bottom-0 border-t border-neutral-600 w-full pr-2 pb-1'>
                    <h3 className='pt-1'>Your hand</h3>
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

                canAddToTriples={currentRound === gamestate.playerInfo[user.uid].index && gamestate.cardPickedUpThisRound && hasATripleAlready}
                handler={(cards: Card[]) => {
                    setCompletedTripleHolder(cards)
                    setSelectorMode(SelectorModeEnum.COMPLETE_OTHER_TRIPLE)
                    setCompletedTriplesModalOpen(false)
                }}
            />

            <GameoverModal
                modalOpen={gameoverPopup}
                setModalOpen={setGameoverPopup}
                gameroomId={gameroomId}
                isWinner={gamestate.winner === user.uid}
                winnersDisplayname={gamestate.winner && gamestate.playerInfo[gamestate.winner].displayName}
            />
        </>
    )
}