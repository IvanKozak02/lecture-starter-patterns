import type {Socket} from "socket.io";

import {List} from "../data/models/list";
import {SocketHandler} from "./socket.handler";
import {getListName} from "../helpers/list.helper";
import {ListEvent} from "../../../common/enums/enums";
import {LogLevel} from "../common/enums/enums";

class ListHandler extends SocketHandler {


  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
    this.logService.log(LogLevel.INFO, 'get lists from DB');
  }

  private deleteList(listId: string): void {
    const lists = this.db.getData();
    const listName = getListName(lists, listId);
    const updatedLists = lists.filter(list => list.id !== listId);
    this.saveAndUpdate(updatedLists);
    const undoAction = () => this.createList(listName);
    this.saveState(undoAction);
    this.logService.log(LogLevel.INFO, `remove list ${listName} from DB`);
  }

  private renameList(listId: string, newName: string): void {
    const lists = this.db.getData();
    let oldListName;
    if (newName){
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          oldListName = list.name;
          list.name = newName;
        }
        return list;
      })
      this.saveAndUpdate(updatedLists);
      const undoAction = () => this.renameList(listId,oldListName);
      this.saveState(undoAction);
      this.logService.log(LogLevel.INFO, `rename list ${getListName(lists, listId)}`);
    }else {
      this.logService.log(LogLevel.ERROR, `name for list cannot be empty!!!`);
    }
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    const undoAction = () => this.reorderLists(destinationIndex, sourceIndex);
    this.saveState(undoAction);
    this.saveAndUpdate(reorderedLists);
    this.logService.log(LogLevel.INFO, `reorder lists`);
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    let newListId;
    if (name){
      const newList = new List(name);
      newListId = newList.id;
      this.saveAndUpdate([...lists, newList]);
      const undoAction = () => this.deleteList(newListId);
      this.saveState(undoAction);
      this.logService.log(LogLevel.INFO, `create new list ${newList.name}`);
    }else {
      this.logService.log(LogLevel.ERROR, `list cannot have empty name!!!`);

    }

  }
}

export {ListHandler};
