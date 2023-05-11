import { useEffect, useMemo } from "react";
import { noOp } from "../utils";
import { APIData, Location, LocationType, locationTypes } from "../utils/types";
import { Select } from "components/Forms/Form";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { gql, useQuery } from "@apollo/client";
import { listLocationsQuery } from "graphql";

type SelectLocationProps = {
  /** ID of location to exclude from list */
  excludeLocation?: number;
  worldId?: number;
  /** (Optional) Type of location that the parent will be assigned to */
  targetType?: LocationType;
  locations?: APIData<Location>[];
  value?: string | number;
  placeholder?: string;
  onChange?: (locationId: number) => void;
};
/** Select a `Location` from the currently-focused world */

export default function SelectParentLocation(props: SelectLocationProps) {
  const {
    excludeLocation,
    targetType,
    value = "",
    placeholder = "Select Location:",
    onChange = noOp
  } = props;
  const superTypes = new Set([LocationType.Region]);
  const { focusedLocation, focusedWorld } = useGlobalWorld([
    "focusedLocation",
    "focusedWorld"
  ]);
  const worldId = props.worldId || focusedWorld?.id;
  const vars = { variables: { worldId } };
  const { data, loading } = useQuery(gql(listLocationsQuery()), vars);
  const locations: APIData<Location>[] = data?.listLocations || [];
  const validLocations = useMemo(() => {
    if (!targetType || !locations.length) return locations;
    const validTypes = new Set(
      locationTypes.slice(0, locationTypes.indexOf(targetType))
    );

    return locations.filter(({ type, id }) => {
      if (superTypes.has(type)) return true;
      if (id === excludeLocation) return false;
      return validTypes.has(type);
    });
  }, [locations, targetType]);

  useEffect(() => {
    if (!value && focusedLocation) onChange(focusedLocation.id);
  }, []);

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
