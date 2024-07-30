import ActionMemento from "./action-memento";

class ActionCaretaker {
  private undoStack: ActionMemento[] = [];
  private redoStack: ActionMemento[] = [];

  addMemento(memento: ActionMemento): void {
    this.undoStack.push(memento);
  }

  undo(): ActionMemento | undefined {
    const memento = this.undoStack.pop();
    if (memento) {
      this.redoStack.push(memento);
    }
    return memento;
  }

  redo(): ActionMemento | undefined {
    const memento = this.redoStack.pop();
    if (memento) {
      this.undoStack.push(memento);
    }
    return memento;
  }
}

export default ActionCaretaker;
