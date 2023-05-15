type Describable = {
  name?: string;
  title?: string;
  description?: string;
  type:
    | "adventure"
    | "place"
    | "character"
    | "character group"
    | "item"
    | "event"
    | "chapter"
    | "book"
    | "scene";
};

/** Generate ideas for describing a new thing */
export function buildDescriptionPrompt(o: Describable) {
  const { type, name, title, description } = o;
  const nom = name || title;
  if (!description && !nom) return `[ DESCRIBE LOCATION ] A new ${type}`;
  if (!description) return `[ DESCRIBE LOCATION ] A ${type} called "${nom}"`;
  if (!nom)
    return `[ DESCRIBE LOCATION ] A ${type} described as "${description}"`;
  return null;
}

/** Generate ideas for describing a new thing */
export function buildNamePrompt(o: Describable) {
  const { type, name, title, description } = o;
  const nom = name || title;
  if (nom) return null;
  if (!description && !nom)
    return `[ CREATIVE NAME ] A creative name for a new ${type}`;
  return `[ CREATIVE NAME ] A creative name for a ${type} described as "${description}"`;
}
