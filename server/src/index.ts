import {createServer} from "http";
import {Server, Socket} from "socket.io";

import {lists} from "./assets/mock-data";
import {Database} from "./data/database";
import {CardHandler, ListHandler} from "./handlers/handlers";
import LogFileSubscriber from "./services/logger/subscribers/log-file.subscriber";
import LogConsoleErrorSubscriber from "./services/logger/subscribers/log-console-error.subscriber";
import ProxyReorderService from "./services/reorder.service/proxy-reorder.service";
import {LogService} from "./services/logger/log.service";
import {UndoRedoService} from "./services/undo-redo.service/undo-redo.service";

const PORT = 3005;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const db = Database.Instance;
const logService = new LogService();    // PATTERN:{OBSERVER}

const logFileSubscriber = new LogFileSubscriber('../logs.txt');
logService.subscribe('info', logFileSubscriber);
logService.subscribe('warning', logFileSubscriber);
logService.subscribe('error', new LogConsoleErrorSubscriber());
const reorderService = new ProxyReorderService(logService);         // PATTERN:{PROXY}
const undoRedoService = new UndoRedoService();


if (process.env.NODE_ENV !== "production") {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  socket.on('UNDO', () => {
    undoRedoService.undo();
  })
  socket.on('REDO', () => {
    undoRedoService.redo();
  })
  new ListHandler(io, db, reorderService, logService, undoRedoService).handleConnection(socket);
  new CardHandler(io, db, reorderService, logService, undoRedoService).handleConnection(socket);
};

io.on("connection", onConnection);

httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

export {httpServer};
