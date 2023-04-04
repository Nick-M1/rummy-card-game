// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//
// // fake data generator
// const getItems = count =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k}`,
//         content: `item ${k}`,
//     }));
//
// // a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//
//     return result;
// };
//
// const grid = 8;
//
// const getItemStyle = (isDragging, draggableStyle) => ({
//     // some basic styles to make the items look a bit nicer
//     userSelect: 'none',
//     padding: grid * 2,
//     margin: `0 ${grid}px 0 0`,
//
//     // change background colour if dragging
//     background: isDragging ? 'lightgreen' : 'grey',
//
//     // styles we need to apply on draggables
//     ...draggableStyle,
// });
//
// const getListStyle = (isDraggingOver: boolean) => ({
//     background: isDraggingOver ? 'lightblue' : 'lightgrey',
//     display: 'flex',
//     padding: grid,
//     overflow: 'auto',
// });
//
// class App extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             items: getItems(6),
//         };
//         this.onDragEnd = this.onDragEnd.bind(this);
//     }
//
//     onDragEnd(result) {
//         // dropped outside the list
//         if (!result.destination) {
//             return;
//         }
//
//         const items = reorder(
//             this.state.items,
//             result.source.index,
//             result.destination.index
//         );
//
//         this.setState({
//             items,
//         });
//     }
//
//     // Normally you would want to split things out into separate components.
//     // But in this example everything is just done in one place for simplicity
//     render() {
//         return (
//             <DragDropContext onDragEnd={this.onDragEnd}>
//                 <Droppable droppableId="droppable" direction="horizontal">
//                     {(provided, snapshot) => (
//                         <div
//                             ref={provided.innerRef}
//                             style={getListStyle(snapshot.isDraggingOver)}
//                             {...provided.droppableProps}
//                         >
//                             {this.state.items.map((item, index) => (
//                                 <Draggable key={item.id} draggableId={item.id} index={index}>
//                                     {(provided, snapshot) => (
//                                         <div
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                             style={getItemStyle(
//                                                 snapshot.isDragging,
//                                                 provided.draggableProps.style
//                                             )}
//                                         >
//                                             {item.content}
//                                         </div>
//                                     )}
//                                 </Draggable>
//                             ))}
//                             {provided.placeholder}
//                         </div>
//                     )}
//                 </Droppable>
//             </DragDropContext>
//         );
//     }
// }

import Card from "./Card";
// import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
// import {useState} from "react";



type Props = {
    cards: Card[]
    selectTripleListIds: string[]
    cardOnclickHandler: (card: Card) => void
}

// const reorder = (list: Card[], startIndex: number, endIndex: number) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//
//     return result;
// };

export default function PlayerHand({ cards, selectTripleListIds, cardOnclickHandler }: Props) {
    // const [playersHand, setPlayersHand] = useState({ cards });
    //
    // function onDragEnd(result: DropResult) {
    //     if (!result.destination)
    //         return;
    //
    //     if (result.destination.index === result.source.index)
    //         return;
    //
    //
    //     const reorderedCards = reorder(
    //         cards,
    //         result.source.index,
    //         result.destination.index
    //     );
    //
    //     setPlayersHand({ cards: reorderedCards });
    // }

    // return (
    //     <DragDropContext onDragEnd={onDragEnd}>
    //         <Droppable droppableId="list">
    //             {provided => (
    //                 <div ref={provided.innerRef} {...provided.droppableProps}>
    //                     { playersHand.cards.map((card, index) => (
    //
    //                         <Draggable draggableId={card.id} index={index}>
    //                             {provided => (
    //                                 <Card
    //                                     ref={provided.innerRef}
    //                                     key={card.id}
    //                                     card={card}
    //                                     isHighlighted={selectTripleListIds.includes(card.id)}
    //                                     handler={cardOnclickHandler}
    //                                 />
    //                                 // <QuoteItem
    //                                 //     ref={provided.innerRef}
    //                                 //     {...provided.draggableProps}
    //                                 //     {...provided.dragHandleProps}
    //                                 // >
    //                                 //     {quote.content}
    //                                 // </QuoteItem>
    //                             )}
    //                         </Draggable>
    //
    //                     ))}
    //
    //                     {provided.placeholder}
    //                 </div>
    //             )}
    //         </Droppable>
    //     </DragDropContext>
    // )


    return (
        <div className='flex pt-3 overflow-x-auto scrollbar'>
            { cards.map(card => (
                <Card
                    key={card.id}
                    card={card}
                    isHighlighted={selectTripleListIds.includes(card.id)}
                    handler={cardOnclickHandler}
                />
            ))}
        </div>
    );
}