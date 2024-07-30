const CardEvent = {
  CREATE: "card:create",
  DELETE: "card:delete",
  RENAME: "card:rename",
  CHANGE_DESCRIPTION: "card:changeDescription",
  DUPLICATE_CARD: "card:duplicateCard",
  REORDER: "card:reorder",
} as const;

export { CardEvent };
