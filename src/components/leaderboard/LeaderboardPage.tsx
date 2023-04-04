import {User} from "firebase/auth";
import HeaderComponent from "../../layout/HeaderComponent";
import UserprofileDropdown from "../authentication/UserprofileDropdown";
import {deleteDoc, doc} from "@firebase/firestore";
import {db} from "../../firebase";
import {useNavigate} from "react-router-dom";

type Props = {
    user: User
    gameroomId: string
    resultsData: ResultsDBType
}

function range(total: number) {
    return [ ...Array(total).keys() ]
}


const MIN_NUMBER_OF_ROUNDS = 4

export default function LeaderboardPage({ user, gameroomId, resultsData }: Props) {
    const navigator = useNavigate()

    const newRoundHandler = () => {
        deleteDoc(doc(db, "games", gameroomId))
        navigator(`/${gameroomId}`)
    }

    const numberOfRounds = Math.max(resultsData.rounds[user.uid].length, MIN_NUMBER_OF_ROUNDS)

    return (
        <div className='w-screen h-screen bg-neutral-800 text-gray-300 px-2'>
            <HeaderComponent displaynameText={`Welcome ${user.displayName}`}>
                <UserprofileDropdown user={user}/>
            </HeaderComponent>
            <div className='border-b border-neutral-700 w-full py-1'/>

            <div className='py-8 md:mx-8 px-2 flex justify-between'>
                <div/>
                <h1 className='text-3xl font-semibold'>🏆 Leaderboard</h1>
                <button onClick={newRoundHandler} className='btn-tertiary py-2.5'>Start New Match</button>
            </div>

            <div className="md:mx-8 relative overflow-x-auto shadow-md rounded-lg scrollbar">
                <table className="w-full bg-white/20 text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-800 bg-white/20">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                PLAYERS
                            </th>
                            { range(numberOfRounds).map((roundNumber) => (
                                <th scope="col" className="px-6 py-3" key={roundNumber}>
                                    ROUND { roundNumber + 1 }
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3">
                                TOTAL
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                    { Object.entries(resultsData.playerInfo)
                        .sort((p1, p2) => p1[1].index - p2[1].index)
                        .map(([playerId, playerInfo]) => {
                            const playerScores = resultsData.rounds[playerId]
                            const totalScore = playerScores.reduce((num1, num2) => num1 + num2, 0)
                            const playerScoresDisplay = playerScores.length >= numberOfRounds ? playerScores : [...playerScores, ...Array(numberOfRounds - playerScores.length).fill('-')]

                            return (
                                <tr key={playerId} className={`group border-b border-gray-800 smooth-transition ${playerId == user.uid && 'bg-blue-700/10'}`}>
                                    <th scope="row"  className="flex items-center px-6 py-4 text-gray-300 font-semibold whitespace-nowrap">
                                        <img src={playerInfo.displayImage} alt='student profile' className='w-10 h-10 rounded-full shadow-sm mr-3'/>
                                        { playerInfo.displayName }
                                    </th>

                                    { playerScoresDisplay.map((scores, index) => (
                                        <td className="px-6 py-4 text-gray-300" key={index}>
                                            {scores}
                                        </td>
                                    ))}

                                    <td className="px-6 py-4 text-gray-100">
                                        { totalScore }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}