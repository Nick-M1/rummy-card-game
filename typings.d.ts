type Card = {
    id: string
    suite: string
    rank: string
    name: string
    img: string

    ranking: number
    value: number
}

type GameType = {
    numberOfPlayers: number
    round: number
    cardPickedUpThisRound: boolean

    newCardsPile: Card[]
    discardPile: Card[]
    triplesCreated: Map<number, Card>[]

    playerInfo: {
        [key: string]: {
            index: number
            displayName: string
            displayImage: string
        }
    }

    playerHands: {
        [key: string]: Card[]
    }

    playerHasTriple: {
        [key: string]: boolean
    }
}