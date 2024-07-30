import {List} from "../../data/models/list";
import {ReorderService} from "./reorder.service";
import LogService from "../logger/log.service";
import {IReorderService} from "../../common/interfaces/reorder-service.interface";

class ProxyReorderService implements IReorderService{
  private reorderService: ReorderService;
  private logService: LogService;

  constructor(logService: LogService) {
    this.reorderService = new ReorderService();
    this.logService = logService;
  }

  reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    this.logService.log('info',`Calling reorder function with arguments:\n${JSON.stringify(arguments[0], null, ' ')}\nstartIndex: ${startIndex}\nendIndex: ${endIndex}`);
    return this.reorderService.reorder(items, startIndex, endIndex);
  }

  reorderCards({
                 lists,
                 sourceIndex,
                 destinationIndex,
                 sourceListId,
                 destinationListId,
               }: { lists: List[]; sourceIndex: number; destinationIndex: number; sourceListId: string; destinationListId: string }): List[] {
    this.logService.log('info', `Calling reorderCards function with arguments:\n${JSON.stringify(arguments[0], null, " ")}`);
    return this.reorderService.reorderCards({ lists, sourceIndex, destinationIndex, sourceListId, destinationListId });
  }

}


export default ProxyReorderService;
