import { Server, Socket } from "socket.io";

import { Database } from "../data/database";
import {List} from "../data/models/list";
import ProxyReorderService from "../services/reorder.service/proxy-reorder.service";
import {ListEvent} from "../../../common/enums/enums";
import {LogLevel} from "../common/enums/enums";
import {MementoActionFunc} from "../services/undo-redo.service/action-memento";
import {LogService} from "../services/services";
import {UndoRedoService} from "../services/services";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ProxyReorderService;

  protected logService: LogService;

  protected undoRedoService: UndoRedoService;

  protected io: Server;

  public constructor(io: Server, db: Database, reorderService: ProxyReorderService, logService: LogService, undoRedoService: UndoRedoService) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.logService = logService;
    this.undoRedoService = undoRedoService;
  }



  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
  protected saveState(undoAction: MementoActionFunc): void {
    this.undoRedoService.addAction({undoAction});
  }
  protected saveAndUpdate(lists: List[]){
    this.db.setData(lists);
    this.logService.log(LogLevel.INFO, 'save updated data to DB')
    this.updateLists();
  }

}

export { SocketHandler };
