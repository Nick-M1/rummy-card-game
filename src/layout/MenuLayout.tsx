import {ReactNode} from "react";

type Props = {
    children: ReactNode
}

export default function MenuLayout({ children }: Props) {
    return (
        <div className='flex flex-col px-2 text-gray-300 max-h-[70dvh] tall-md:max-h-[80dvh] tall-lg:max-h-[85dvh] overflow-y-auto scrollbar'>
            <div className='border-b border-neutral-700 w-full py-1'/>
            <img src='/homepage-icon.svg' alt='home-icon' className='h-[30vh] w-fit mx-auto py-3'/>

            { children }

            <div className='px-6 md:px-32'>
                <div className='bg-white/10 rounded-lg px-7 py-3 my-5 w-fit mx-auto text-gray-400 shadow-2xl break-keep overflow-y-scroll scrollbar'>
                    <h3 className='text-center text-lg font-semibold text-gray-300 pb-2'>Game Instructions - Rummy</h3>
                    <ol className='list-inside list-decimal list-image-[url(assets/list-marker.svg)]'>
                        <li>Initially, each player receives 10 cards.</li>
                        <li>Each turn, the player will draw a card (either from the stock or the discard pile) and will aim to form
                            matching sets from their hand and place these matching sets down, as well as discarding a card at the end of their turn.</li>
                        <li>A matching set is formed from 3 or more cards with either the same ranks and different suites OR the same suite by consecutive ranks.</li>
                        <li>Once a player has placed down at-least 1 matching set, then they are able to add to other players' placed-down matching sets</li>
                        <li>A Joker card can be used in place of any missing card in the matched set</li>
                        <li>The first player to discard their whole hand wins, and the sum of each player's hand will be their score for the match (lower score is better).</li>

                        <li>NOTE the rank of cards from low to high: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}