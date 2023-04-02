type Props = {
    card: Card
    isHighlighted: boolean
    handler: (card: Card) => void
}

export default function Card({ card, isHighlighted, handler }: Props) {

    return (
        <div onClick={() => handler(card)} className={`group relative flex-shrink-0 p-0.5 rounded-md cursor-pointer ${isHighlighted && 'bg-teal-500'}`}>
            <img src={card.img} alt={card.name} className='h-40'/>
            <div className='absolute inset-0 group-hover:bg-teal-500/20 rounded-md smooth-transition'/>
        </div>
    );
}