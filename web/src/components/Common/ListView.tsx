import React, { ReactNode, ReactText } from "react";
import styled, { css } from "styled-components";
import { noOp, suppressEvent } from "../../utils/index";

const sharedListStyles = css<StyledListProps>`
  display: flex;
  flex-direction: ${({ row }) => (row ? "row" : "column")};
`;
type StyledListProps = { itemWidth?: string; row?: boolean; grid?: boolean };
const OrderedList = styled.ol<StyledListProps>`
  ${sharedListStyles}
  > * {
    width: 100%;
  }
`;
const UnorderedList = styled.ul<StyledListProps>`
  ${sharedListStyles}
  list-style: none;
  margin: 0;
  padding: 0;
  > * {
    padding: 0;
  }
`;
/** Grid-style list container */
const GridList = styled(UnorderedList)<{ itemWidth?: string }>`
  align-items: center;
  display: grid;
  grid-auto-rows: minmax(100px, auto);
  grid-gap: ${({ theme }) => theme.sizes.sm};
  grid-template-columns: ${({ itemWidth = "150px" }) =>
    `repeat(auto-fill, ${itemWidth})`};
  place-content: flex-start;
  margin: 0 auto;
  max-width: 100%;
  padding: ${({ theme }) => theme.sizes.sm};
  width: 100%;

  > li {
    border: 0;
  }
`;
/** Single item in a `ListView` */
const ListViewItem = styled.li`
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  display: flex;
  flex-shrink: 0;
  text-align: left;
  /* overflow: hidden; */

  &:last-of-type {
    border: 0;
  }

  &.rounded {
    &:last-child,
    &:first-child {
      border-radius: ${({ theme }) => theme.presets.round.sm};
    }

    &:last-child {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    &:first-child {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
`;

export type ListViewProps<T> = {
  data: T[];
  ordered?: boolean;
  row?: boolean;
  grid?: boolean;
  placeholder?: string;
  rounded?: boolean;
  dummyFirstItem?: ReactNode;
  dummyLastItem?: ReactNode;
  itemWidth?: string;
  itemText: (d: T, i?: number) => ReactNode;
  onItemClick?: (d: T) => any | void;
} & React.ComponentPropsWithRef<"ul" | "ol">;
/**
 * `ListView` for displaying a or horizontal list of items
 * @returns {JSX.Element} `ListView` with ordered or unordered items
 */
const ListView = styled((props: ListViewProps<any>): JSX.Element => {
  const {
    data,
    itemText,
    itemWidth = "200px",
    onItemClick = noOp,
    rounded = true,
    grid = false,
    placeholder,
    dummyFirstItem,
    dummyLastItem,
    ordered,
    row,
    ...rest
  } = props;
  const Wrapper: any = grid ? GridList : ordered ? OrderedList : UnorderedList;
  const itemClassname = rounded ? "rounded" : "";
  const itemClicked = (item: any) => (e: React.MouseEvent) => {
    suppressEvent(e);
    onItemClick(item);
  };

  return (
    <Wrapper row={row} itemWidth={itemWidth} {...rest}>
      {dummyFirstItem && (
        <ListViewItem className={itemClassname}>{dummyFirstItem}</ListViewItem>
      )}

      {data.map((item: any, i: number) => (
        <ListViewItem
          key={i}
          className={itemClassname}
          onClick={itemClicked(item)}
        >
          {itemText(item, i)}
        </ListViewItem>
      ))}

      {placeholder && !data.length && (
        <ListViewItem className={itemClassname}>{placeholder}</ListViewItem>
      )}

      {dummyLastItem && (
        <ListViewItem className={itemClassname}>{dummyLastItem}</ListViewItem>
      )}
    </Wrapper>
  );
})``;
export default ListView;

export const WideListView = styled(ListView)`
  max-width: 50vmin;

  @media screen and (max-width: 768px) {
    max-width: 85vmin;
  }
`;
