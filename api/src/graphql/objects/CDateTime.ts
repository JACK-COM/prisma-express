import { DateTime } from "luxon";
import { scalarType } from "nexus";

/** Custom Date-time scalar for date fields */
export const CsDateTime = scalarType({
  name: "CsDateTime",
  asNexusMethod: "date",
  description: "UTC Date-time",

  parseLiteral(lit) {
    if (lit.kind === "IntValue")
      return DateTime.fromMillis(Number(lit.value)).toUTC().toJSDate();
    if (lit.kind === "StringValue")
      return DateTime.fromISO(lit.value).toUTC().toJSDate();
    return null;
  },

  parseValue(value) {
    return typeof value === "string"
      ? DateTime.fromJSDate(new Date(value)).toUTC().toString()
      : null;
  },

  serialize(value) {
    return (value as any)?.toString();
  }
});
