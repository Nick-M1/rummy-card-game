type Props = {
    card: Card
    isHighlighted: boolean
    handler: (card: Card) => void
}

export default function Card({ card, isHighlighted, handler }: Props) {

    return (
        <div onClick={() => handler(card)} className={`group relative flex-shrink-0 p-0.5 rounded-md cursor-pointer ${isHighlighted && 'bg-teal-500'}`}>
            <img src={card.img} alt={card.name} className='h-40'/>
            <div id={`hand-${card.id}`} className={`absolute inset-0 rounded-md smooth-transition ${isHighlighted ? 'bg-teal-500/20 group-hover:md:bg-teal-500/30' : 'group-hover:md:bg-teal-500/20'}`}/>
        </div>
    );
}