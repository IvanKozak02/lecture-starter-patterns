import type {DraggableLocation} from "@hello-pangea/dnd";

import {type Card, type List} from "../common/types/types";

const reorderElements = <T>(items: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const getCards = (lists: List[], location: DraggableLocation) => {
  return lists.find((list) => list.id === location.droppableId)?.cards || [];
}

const removeCardFromList = (cards: Card[], index: number): Card[] => {
  return cards.filter((_, i) => i !== index);
}

const addCardToList = (cards: Card[], index: number, card: Card): Card[] => {
  const updatedCards = [...cards];
  updatedCards.splice(index, 0, card);
  return updatedCards;
}

const updateListCards = (
  list: List,
  listId: string,
  updatedCards: Card[]
): List => {
  return list.id === listId ? { ...list, cards: updatedCards } : list;
};

const reorderCardsInSameList = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const current: Card[] = getCards(lists, source);
  const reordered: Card[] = reorderElements<Card>(current, source.index, destination.index);
  return lists.map(list => updateListCards(list, source.droppableId, reordered));
};


const reorderCardsInDifferentLists = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const current: Card[] = getCards(lists, source);
  const next: Card[] = getCards(lists, destination);
  const target: Card = current[source.index];
  const updatedSourceCards = removeCardFromList(current, source.index);
  const updatedDestinationCards = addCardToList(next, destination.index, target);

  return lists.map(list => {
    if (list.id === source.droppableId) {
      return updateListCards(list, source.droppableId, updatedSourceCards);
    }

    if (list.id === destination.droppableId) {
      return updateListCards(list, destination.droppableId, updatedDestinationCards);
    }
    return list;
  });
};


const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const isMovingInSameList = source.droppableId === destination.droppableId;
  if (isMovingInSameList) {
    return reorderCardsInSameList(lists, source, destination);
  }
  return reorderCardsInDifferentLists(lists, source, destination);
}


export {reorderCards, reorderElements};
