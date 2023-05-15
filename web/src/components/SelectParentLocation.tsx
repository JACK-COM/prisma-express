import { useMemo } from "react";
import { noOp } from "../utils";
import { APIData, Location, LocationType, locationTypes } from "../utils/types";
import { Select } from "components/Forms/Form";
import { gql, useQuery } from "@apollo/client";
import { listLocationsQuery } from "graphql";
import { GlobalWorld } from "state";

type SelectLocationProps = {
  /** ID of location to exclude from list */
  excludeLocation?: number;
  worldId?: number;
  /** (Optional) Type of location that the parent will be assigned to */
  targetType?: LocationType;
  value?: string | number;
  placeholder?: string;
  onChange?: (locationId: number) => void;
};

// Locations that can contain any type of location
const superTypes = new Set([LocationType.Region]);

/** Select a `Location` from the currently-focused world */
export default function SelectParentLocation(props: SelectLocationProps) {
  const {
    excludeLocation,
    targetType,
    value = "",
    placeholder = "Select Location:",
    onChange = noOp
  } = props;
  const { focusedWorld } = GlobalWorld.getState();
  const worldId = props.worldId || focusedWorld?.id;
  const vars = { variables: { worldId } };
  const { data, loading } = useQuery(gql(listLocationsQuery()), vars);
  const locations: APIData<Location>[] = data?.listLocations || [];
  const validLocations = useMemo(() => {
    if (!targetType || !locations.length || superTypes.has(targetType)) {
      return locations;
    }

    const validTypes = new Set(
      locationTypes.slice(0, locationTypes.indexOf(targetType))
    );
    validTypes.add(LocationType.Other);

    return locations.filter(({ type, id }) => {
      if (superTypes.has(type)) return true;
      if (id === excludeLocation) return false;
      return validTypes.has(type);
    });
  }, [locations, targetType, value]);

  return (
    <Select
      disabled={loading || !validLocations.length}
      data={validLocations}
      value={value}
      itemText={(d) => `${d.name} (${d.type})`}
      itemValue={(d) => d.id}
      placeholder={placeholder}
      onChange={(pid) => onChange(Number(pid))}
    />
  );
}
