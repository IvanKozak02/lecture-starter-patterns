export type MementoActionFunc = () => void;

export interface MementoState {
  undoAction: MementoActionFunc;
}

class ActionMemento {
  private readonly state: MementoState;

  constructor(mementoState: MementoState) {
    this.state = mementoState;
  }

  getState(): MementoState {
    return this.state;
  }
}

export default ActionMemento;
