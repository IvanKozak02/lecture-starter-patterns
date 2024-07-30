import {List} from "../../data/models/list";

interface IReorderService {
  reorder<T>(items: T[], startIndex: number, endIndex: number): T[];
  reorderCards({
                 lists,
                 sourceIndex,
                 destinationIndex,
                 sourceListId,
                 destinationListId,
               }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[];


}

export type {IReorderService}
