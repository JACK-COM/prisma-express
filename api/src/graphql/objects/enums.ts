import { enumType } from "nexus";

/** Example ENUM; you can remove or redefine */
export const Temperature = enumType({
  name: "Temperature",
  description: "Vague measure of pressure in system",
  members: {
    hot: "hot",
    warm: "warm",
    cool: "cool"
  }
});
