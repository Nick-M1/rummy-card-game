import {doc, getDoc} from "@firebase/firestore";
import {db} from "../firebase";

export type LoaderOutputType = {
    gameroomId: string
    results: ResultsDBType
}

export async function leaderboardLoader({ params }: any) {
    const response = await getDoc(doc(db, "results", params.gameroomId))
    const results = response.data() as ResultsDBType
    return { gameroomId: params.gameroomId, results }
}