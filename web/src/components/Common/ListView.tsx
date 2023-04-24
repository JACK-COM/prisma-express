import React, { ReactNode, ReactText } from "react";
import styled, { css } from "styled-components";
import { noOp, suppressEvent } from "../../utils/index";

export type ListViewProps<T> = {
  data: T[];
  ordered?: boolean;
  row?: boolean;
  rounded?: boolean;
  itemText: (d: T, i?: number) => ReactText | ReactNode;
  onItemClick?: (d: T) => any | void;
} & React.ComponentPropsWithRef<"ul" | "ol">;

const sharedListStyles = css<{ row?: boolean }>`
  display: flex;
  flex-direction: ${({ row }) => (row ? "row" : "column")};
`;
const OrderedList = styled.ol<{ row?: boolean }>`
  ${sharedListStyles}
  > * {
    width: 100%;
  }
`;
const UnorderedList = styled.ul<{ row?: boolean }>`
  ${sharedListStyles}
  list-style: none;
  margin: 0;
  padding: 0;
  > * {
    padding: 0;
  }
`;
/** Single item in a `ListView` */
const ListViewItem = styled.li`
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}33`};
  display: flex;
  flex-shrink: 0;
  text-align: left;
  overflow: hidden;

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

/**
 * `ListView` for displaying a or horizontal list of items
 * @returns {JSX.Element} `ListView` with ordered or unordered items
 */
const ListView = styled((props: ListViewProps<any>): JSX.Element => {
  const {
    data,
    itemText,
    onItemClick = noOp,
    rounded = true,
    ordered,
    row,
    ...rest
  } = props;
  const Wrapper: any = ordered ? OrderedList : UnorderedList;
  const itemClassname = rounded ? "rounded" : "";
  const itemClicked = (item: any) => (e: React.MouseEvent) => {
    suppressEvent(e);
    onItemClick(item);
  };

  return (
    <Wrapper row={row} {...rest}>
      {data.map((item: any, i: number) => (
        <ListViewItem
          key={i}
          className={itemClassname}
          onClick={itemClicked(item)}
        >
          {itemText(item, i)}
        </ListViewItem>
      ))}
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
