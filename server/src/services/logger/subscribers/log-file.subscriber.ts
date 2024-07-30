import {Subscriber} from "../../../common/interfaces/subscriber.interface";
import * as fs from "fs";

class LogFileSubscriber implements Subscriber {
  private readonly LOG_FILE_PATH;

  constructor(filePath: string) {
    this.LOG_FILE_PATH = filePath;
  }

  notify(logMessage: string): void {
    fs.writeFileSync(this.LOG_FILE_PATH, logMessage + '\n', { flag: 'a' });
  }

}

export default LogFileSubscriber;
