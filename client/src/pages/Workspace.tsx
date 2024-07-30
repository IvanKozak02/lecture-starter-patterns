import type {
  DraggableLocation,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";
import React, {useContext, useEffect, useState} from "react";

import {type List} from "../common/types/types";
import {Column} from "../components/column/column";
import {ColumnCreator} from "../components/column-creator/column-creator";
import {SocketContext} from "../context/socket";
import {reorderCards, reorderElements} from "../services/reorder.service";
import {Container} from "./styled/container";
import {CardEvent, ListEvent} from "../../../common/enums/enums";

export const Workspace = () => {
  const [lists, setLists] = useState<List[]>([]);

  const socket = useContext(SocketContext);

  const handleUndoRedoKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'z') {
      event.preventDefault();
      socket.emit('UNDO');
    }
    if (event.ctrlKey && event.key === 'y') {
      event.preventDefault();
      socket.emit('REDO');
    }
  }


  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => setLists(lists));
    socket.on(ListEvent.UPDATE, (lists: List[]) => setLists(lists));
    document.addEventListener('keydown', handleUndoRedoKeydown);
    return () => {
      socket.removeAllListeners(ListEvent.UPDATE).close();
      document.removeEventListener('keydown',handleUndoRedoKeydown)
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    const isNotMoved =
      source.droppableId === destination.droppableId &&
      source.index === destination?.index;

    if (isNotMoved) {
      return;
    }

    const isReorderLists = result.type === "COLUMN";

    if (isReorderLists) {
      setLists(
        reorderElements<List>(lists, source.index, destination.index)
      );
      socket.emit(ListEvent.REORDER, source.index, destination.index);

      return;
    }

    setLists(reorderCards(lists, source, destination));
    socket.emit(CardEvent.REORDER, {
      sourceListId: source.droppableId,
      destinationListId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  // TASK - 1  Adding lists
  const handleCreateList = (name: string) => {
    if (name) {
      socket.emit("list:create", name);
    }
  }


  // TASK - 1  Adding lists


  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Container
              className="workspace-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list: List, index: number) => (
                <Column
                  key={list.id}
                  index={index}
                  listName={list.name}
                  cards={list.cards}
                  listId={list.id}
                />
              ))}
              {provided.placeholder}
              <ColumnCreator onCreateList={handleCreateList}/>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};
