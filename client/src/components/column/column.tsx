import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import {Draggable} from "@hello-pangea/dnd";

import {type Card} from "../../common/types/types";
import {CardsList} from "../card-list/card-list";
import {DeleteButton} from "../primitives/delete-button";
import {Splitter} from "../primitives/styled/splitter";
import {Title} from "../primitives/title";
import {Footer} from "./components/footer";
import {Container} from "./styled/container";
import {Header} from "./styled/header";
import {socket} from "../../context/socket";
import {CardEvent, ListEvent} from "../../../../common/enums/enums";

type Props = {
  listId: string;
  listName: string;
  cards: Card[];
  index: number;
};

export const Column = ({listId, listName, cards, index}: Props) => {

  const handleDeleteList = (listId: string) => {
    socket.emit(ListEvent.DELETE, listId);
  }

  const handleRenameList = (newName: string) => {
    if (newName) {
      socket.emit(ListEvent.RENAME, listId, newName);
    }
  }

  const handleAddNewCard = (cardName: string) => {
    if (cardName) {
      socket.emit(CardEvent.CREATE, listId, cardName);
    }
  }


  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          className="column-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Header
            className="column-header"
            isDragging={snapshot.isDragging}
            {...provided.dragHandleProps}
          >
            <Title
              aria-label={listName}
              title={listName}
              onChange={handleRenameList}
              fontSize="large"
              width={200}
              isBold
            />
            <Splitter/>
            <DeleteButton color="#FFF0" onClick={() => handleDeleteList(listId)}/>
          </Header>
          <CardsList listId={listId} listType="CARD" cards={cards}/>
          <Footer onCreateCard={handleAddNewCard}/>
        </Container>
      )}
    </Draggable>
  );
};
