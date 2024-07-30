import type {Socket} from "socket.io";
import {Card} from "../data/models/card";
import {SocketHandler} from "./socket.handler";
import {List} from "../data/models/list";
import {CardEvent} from "../../../common/enums/enums";
import {LogLevel} from "../common/enums/enums";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeCardDescription.bind(this));
    socket.on(CardEvent.DUPLICATE_CARD, this.duplicateCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
  }




  private handleChangeCard(
    cardId: string,
    cardChangeAction: (list: List) => List
  ): void {
    const lists = this.db.getData();
    const updatedLists = lists.map(list => {
      const listHasCard = list.cards.some(card => card.id === cardId);
      if (listHasCard) {
        return cardChangeAction(list);
      }
      return list;
    });
    this.saveAndUpdate(updatedLists);
  }

  public createCard(listId: string, cardName: string): void {
    if (cardName) {
      const newCard = new Card(cardName, "");
      const lists = this.db.getData();
      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
      );
      this.saveAndUpdate(updatedLists);
      this.logService.log(LogLevel.INFO, `crate new card ${newCard.id}`);
      const undoAction = () => this.deleteCard(newCard.id);
      this.saveState(undoAction);
    } else {
      this.logService.log(LogLevel.ERROR, `card cannot have an empty name!!!`);
    }
  }

  public deleteCard(cardId: string): void {
    this.handleChangeCard(cardId, list => {
      list.setCards(list.cards.filter(card => {
        if (card.id === cardId) {
          const undoAction = () => this.createCard(list.id, card.name);
          this.saveState(undoAction);
          return false;
        }
        return true;
      }));
      return list;
    });
    this.logService.log(LogLevel.INFO, `delete card ${cardId}`);
  }

  public renameCard(cardId: string, newName: string): void {
    let oldCardName;
    if (newName) {
      this.handleChangeCard(cardId, list => {
        list.setCards(list.cards.map(card => {
          if (card.id === cardId) {
            oldCardName = card.name;
            card.name = newName;
          }
          return card;
        }));
        return list;
      });
      const undoAction = () => this.renameCard(cardId, oldCardName);
      this.saveState(undoAction);
      this.logService.log(LogLevel.INFO, `rename card ${cardId}`);
    } else {
      this.logService.log(LogLevel.ERROR, `card name cannot be empty!!!`);
    }

  }

  public changeCardDescription(cardId: string, newDescription: string): void {
    let oldCardDescription;
    this.handleChangeCard(cardId, list => {
      list.setCards(list.cards.map(card => {
        if (card.id === cardId) {
          oldCardDescription = card.description;
          card.description = newDescription;
        }
        return card;
      }));
      return list;
    });
    const undoAction = () => this.changeCardDescription(cardId, oldCardDescription);
    this.saveState(undoAction);
    this.logService.log(LogLevel.INFO, `change card ${cardId} description `);
  }

  public duplicateCard(duplicateCardId: string): void {
    let newCardId;
    this.handleChangeCard(duplicateCardId, list => {
      const cardToDuplicateIndex = list.cards.findIndex(card => card.id === duplicateCardId);
      const cardToDuplicate = list.cards[cardToDuplicateIndex];
      const cardCopy = cardToDuplicate.clone();                                     // PATTERN:{PROTOTYPE}
      newCardId = cardCopy.id;
      list.cards.splice(cardToDuplicateIndex + 1, 0, cardCopy);
      return list;
    });
    const undoAction = () => this.deleteCard(newCardId);
    this.saveState(undoAction);
    this.logService.log(LogLevel.INFO, `create card ${duplicateCardId} copy`);

  }

  private reorderCards({
                         sourceIndex,
                         destinationIndex,
                         sourceListId,
                         destinationListId,
                       }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.saveAndUpdate(reordered);
    const undoAction = () => this.reorderCards({destinationIndex, sourceIndex, destinationListId, sourceListId});
    this.saveState(undoAction);
    this.logService.log(LogLevel.INFO, `reorder cards`);
  }
}

export {CardHandler};
