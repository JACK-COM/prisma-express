import { useMemo } from "react";
import { noOp } from "../utils";
import { APIData, World, WorldType, worldTypes } from "../utils/types";
import { Select } from "components/Forms/Form";
import { GlobalUser } from "state";
import { gql, useQuery } from "@apollo/client";
import { listWorldsQuery } from "graphql";

type ValidateProps<T> = { type: T; id?: number };
/** Return a list of valid parent-types, given a selected `WorldType` */
const validateParents = (
  props: ValidateProps<WorldType>,
  worlds: APIData<World>[]
) => {
  const { type, id } = props;
  const typeIndex = worldTypes.indexOf(type);
  const valid = worldTypes.slice(0, typeIndex);
  return worlds.filter(
    ({ type: t, id: tid }) => tid !== id && valid.includes(t)
  );
};

type SelectParentWorldProps = {
  /** ID of world to exclude from list */
  excludeWorld?: number;
  /** (Optional) Type of world that the parent will be assigned to */
  targetType?: WorldType;
  /** Current value */
  value?: string | number;
  placeholder?: string;
  onChange?: (parentId: number | null) => void;
};

/** Select a Parent `World` from a list */
export default function SelectParentWorld(props: SelectParentWorldProps) {
  const { id: authorId } = GlobalUser.getState();
  const vars = { variables: { authorId } };
  const { loading, data } = useQuery(gql(listWorldsQuery()), vars);
  const worlds: APIData<World>[] = data?.listWorlds || [];
  const {
    excludeWorld,
    targetType,
    value = "",
    placeholder = "Select Parent:",
    onChange = noOp
  } = props;
  const validParents = useMemo(() => {
    return targetType
      ? validateParents({ id: excludeWorld, type: targetType }, worlds)
      : worlds;
  }, [worlds, targetType, loading]);

  return (
    <Select
      disabled={loading || !validParents.length}
      data={validParents}
      value={value || ""}
      itemText={(d) => `${d.name} (${d.type})`}
      itemValue={(d) => d.id}
      placeholder={placeholder}
      onChange={(pid) => onChange(pid ? Number(pid) : null)}
    />
  );
}
