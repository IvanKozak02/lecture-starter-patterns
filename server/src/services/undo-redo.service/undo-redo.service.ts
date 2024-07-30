import ActionOriginator from "./action-originator";
import ActionCaretaker from "./action-caretaker";
import { MementoState } from "./action-memento";

class UndoRedoService {
  actionOriginator: ActionOriginator;
  actionCaretaker: ActionCaretaker;
  private isPerformingUndoRedo: boolean = false;

  constructor() {
    this.actionOriginator = new ActionOriginator();
    this.actionCaretaker = new ActionCaretaker();
  }

  undo(): void {
    const memento = this.actionCaretaker.undo();
    if (memento) {
      this.isPerformingUndoRedo = true;
      this.actionOriginator.restoreFromMemento(memento);
      this.actionOriginator.getContent().undoAction();
      this.isPerformingUndoRedo = false;
    }
  }

  redo(): void {
    const memento = this.actionCaretaker.redo();
    if (memento) {
      this.isPerformingUndoRedo = true;
      this.actionOriginator.restoreFromMemento(memento);
      this.actionOriginator.getContent().undoAction();
      this.isPerformingUndoRedo = false;
    }
  }

  addAction(content: MementoState): void {
    if (!this.isPerformingUndoRedo) {
      this.actionOriginator.setContent(content);
      this.actionCaretaker.addMemento(this.actionOriginator.createMemento());
    }
  }
}

export {UndoRedoService};
