import {List} from "../data/models/list";
const getListName = (lists: List[], listId) => {
  return lists.find(list => list.id === listId)?.name;
}

export {getListName};
