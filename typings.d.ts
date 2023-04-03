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
    winner: string | null     // null = No winner, otherwise is the winner's user.uid

    newCardsPile: Card[]
    discardPile: Card[]
    triplesCreated: {
        [key: string]: Card[]
    },

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