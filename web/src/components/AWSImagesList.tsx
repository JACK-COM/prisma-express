import { gql, useQuery } from "@apollo/client";
import { listFiles } from "api/loadUserData";
import { useMemo, useState } from "react";
import { addNotification, updateAsError } from "state";
import { FileUploadCategory } from "utils/types";
import ListView from "./Common/ListView";
import ImageLoader from "./Common/ImageLoader";
import styled from "styled-components";
import { noOp } from "utils";
import { Accent } from "./Common/Containers";
import { Hint } from "./Forms/Form";

const ListTitle = styled.h4.attrs({ className: "h5" })`
  text-transform: capitalize;
`;
const Selectable = styled.span`
  cursor: pointer;
  padding: 0.2rem;
  &:hover {
    background: ${({ theme }) => theme.colors.semitransparent};
  }
`;

type ImageListProps = {
  category?: FileUploadCategory;
  listDescription?: string;
  onImageSelect?: (src: string) => void;
};

/** A self-loading list of images from AWS */
export const AWSImagesList = (props: ImageListProps) => {
  const { category = "worlds", onImageSelect = noOp, listDescription } = props;
  const { loading, data, error } = useQuery(
    gql`
      query ($category: String!) {
        listUserFiles(category: $category)
      }
    `,
    { variables: { category }, fetchPolicy: "network-only" }
  );
  const images = useMemo<string[]>(() => data?.listUserFiles || [], [data]);
  if (loading)
    return (
      <div>
        Finding images from your <Accent>{category}</Accent> ...
      </div>
    );
  if (error)
    return (
      <div>
        <ListTitle>{category} Images</ListTitle>
        {error.message}
      </div>
    );
  if (!images.length) return <></>;

  return (
    <>
      <ListTitle>
        <Accent>{category}</Accent> Images
      </ListTitle>

      {listDescription && <Hint>{listDescription}</Hint>}

      <ListView
        grid
        data={images}
        itemText={(src) => (
          <Selectable>
            <ImageLoader src={src} height={80} />
          </Selectable>
        )}
        itemWidth="100px"
        onItemClick={onImageSelect}
      />
      <hr />
    </>
  );
};

export default AWSImagesList;
