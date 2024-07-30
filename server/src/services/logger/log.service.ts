import {Subscriber} from "../../common/interfaces/subscriber.interface";

class LogService {
  private readonly subscribers: Subscriber[];

  constructor() {
    this.subscribers = [];
  }

  subscribe(level: string, newSubscriber: Subscriber) {
    if (!this.subscribers[level]) {
      this.subscribers[level] = [];
    }
    this.subscribers[level].push(newSubscriber);
  }

  log(level: string, message: string) {
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    this.notifySubscribers(level, logMessage);
  }

  notifySubscribers(level: string, logMessage: string) {
      this.subscribers[level].forEach(subscriber =>subscriber.notify(logMessage));
  }

}

export {LogService};
