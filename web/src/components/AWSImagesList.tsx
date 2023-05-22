import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { FileUploadCategory } from "utils/types";
import ListView from "./Common/ListView";
import ImageLoader from "./Common/ImageLoader";
import styled from "styled-components";
import { noOp } from "utils";
import { Accent, Selectable } from "./Common/Containers";
import { Hint } from "./Forms/Form";

const ListTitle = styled.h4.attrs({ className: "h5" })`
  text-transform: capitalize;
`;

type ImageListProps = {
  category?: FileUploadCategory;
  listDescription?: string;
  onImageSelect?: (src: string) => void;
};

const LIST_USER_FILES = gql`
  query ($category: String!) {
    listUserFiles(category: $category)
  }
`;

/** A self-loading list of images from AWS */
export const AWSImagesList = (props: ImageListProps) => {
  const { category = "worlds", onImageSelect = noOp, listDescription } = props;
  const { loading, data, error } = useQuery(LIST_USER_FILES, {
    variables: { category },
    fetchPolicy: "cache-first"
  });
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
        className="slide-in-down"
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
