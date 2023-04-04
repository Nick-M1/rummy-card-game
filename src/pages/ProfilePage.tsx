import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {getDoc} from "@firebase/firestore";
import {doc} from "firebase/firestore";
import {db} from "../firebase";
import {Link} from "react-router-dom";

type Props = {
    user: User
}

export default function ProfilePage({ user }: Props) {
    const [userDB, setUserDB] = useState<UserDBType>()

    useEffect(() => {
        getDoc(doc(db, "users", user.uid)).then(r => setUserDB(r.data() as UserDBType))
    }, [])

    if (typeof userDB == 'undefined')           //todo: Extra isLoading state and update when initially fetched data
        return <div/>

    return (
        <div className='text-gray-300 px-1'>
            <div className='border-b border-neutral-700 w-full py-1'/>
            <div className='py-8 text-center'>
                <h1 className='text-3xl font-semibold py-3'>🎮 Your Games</h1>
                <p className='text-gray-400'>Click on a game below to rejoin or to view the leaderboard</p>
            </div>

            <div className='bg-white/10 rounded-lg py-8 px-5 mx-6 min-h-[60vh] space-y-4'>
                { userDB.games.map(gameroomId => (
                    <div key={gameroomId} className='flex flex-row items-center space-x-4'>
                        <Link to={`/${gameroomId}/leaderboard`} className='p-4 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 smooth-transition'>
                            Gameroom ID: <span className='font-semibold tracking-wider'>{ gameroomId }</span>
                        </Link>

                        <p>In Progress</p>
                    </div>
                ))}
            </div>
        </div>
    );
}