export const argsToAuthorName = (author = "", name = "") =>
  `${author ? author + " - " : ""}${name}`;
