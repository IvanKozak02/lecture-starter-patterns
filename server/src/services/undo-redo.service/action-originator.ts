import ActionMemento, {MementoState} from "./action-memento";

class ActionOriginator {
  private content: MementoState;

  constructor() {
    this.content = null
  }

  setContent(content: MementoState): void {
    this.content = content;
  }

  getContent(): MementoState {
    return this.content;
  }

  createMemento(): ActionMemento {
    return new ActionMemento(this.content);
  }

  restoreFromMemento(memento: ActionMemento): void {
    this.content = memento.getState();
  }
}

export default ActionOriginator;
