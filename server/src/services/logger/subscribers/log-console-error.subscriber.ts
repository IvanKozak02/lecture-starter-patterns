import {Subscriber} from "../../../common/interfaces/subscriber.interface";

class LogConsoleErrorSubscriber implements Subscriber{
  notify(logMessage: string): void {
    console.error(logMessage);
  }


}

export default LogConsoleErrorSubscriber;
