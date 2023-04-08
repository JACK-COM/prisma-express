import { FlexRow, GridContainer } from "components/Common/Containers";
import { ComponentPropsWithRef } from "react";
import styled, { css } from "styled-components";
import { noOp } from "utils";

type ReactText = string | number;
const requiredInputStyles = css`
  content: "*";
  display: inline-block;
  color: ${({ theme }) => theme.colors.error};
  font-size: 1rem;
`;
const sharedInputStyles = css`
  border-radius: ${({ theme }) => theme.presets.round.sm};
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  font-size: 0.9em;
  height: ${({ theme }) => theme.sizes.lg};
  line-height: ${({ theme }) => theme.sizes.lg};
  padding: ${({ theme }) => theme.sizes.xs};

  @media screen and (max-width: 900px) {
    font-size: 16px;
  }
`;
const sharedRadioStyles = css`
  display: inline-block;
  margin: 0 0.3rem;
  order: -1;
  width: initial;
`;
export const Fieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  border-radius: ${({ theme }) => theme.presets.round.sm};
  padding: ${({ theme }) => theme.sizes.sm};
  margin-bottom: ${({ theme }) => theme.sizes.lg};
  width: calc(100% - 2px) !important;

  &:last-of-type {
    margin-bottom: 0;
  }
`;
export const Input = styled.input`
  ${sharedInputStyles};

  &[type="checkbox"],
  &[type="radio"] {
    ${sharedRadioStyles}
  }
`;

export const Textarea = styled.textarea`
  ${sharedInputStyles};
  height: 120px;
`;
export const Label = styled.label<{ direction?: "row" | "column" }>`
  align-items: ${({ direction }) =>
    direction === "row" ? "center" : undefined};
  display: grid;
  grid-template-columns: ${({ direction }) =>
    direction === "column" ? "auto" : "max-content auto"};

  .label {
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: bold;
    display: inline-block;
    padding-right: ${({ direction, theme }) =>
      direction === "row" ? theme.sizes.sm : undefined};
  }

  .label.required::after {
    ${requiredInputStyles}
  }
`;
export const RadioInput = styled(Input).attrs({ type: "radio" })`
  ${sharedRadioStyles}
`;
export const CheckboxInput = styled(Input).attrs({ type: "checkbox" })`
  ${sharedRadioStyles}
`;
export const RadioLabel = styled(Label)`
  align-items: center;
  gap: 0.33rem;
  grid-template-columns: min-content auto;

  ${RadioInput} {
    margin-right: 0.4rem;
    width: initial;
  }
`;
export const Legend = styled.legend.attrs({ className: "h3" })`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: larger;
  font-weight: 600;
  line-height: ${({ theme }) => theme.sizes.md};
  padding: 0;

  [aria-required]&::after {
    ${requiredInputStyles}
  }
`;
export const Hint = styled.div`
  font-size: smaller;
  line-height: ${({ theme }) => theme.sizes.md};
  margin: 0;
  opacity: 0.7;
  padding: 0;
  width: 100%;
`;
export const HintList = styled.ul`
  margin-left: ${({ theme }) => theme.sizes.sm};
  padding-left: ${({ theme }) => theme.sizes.sm};
`;

type SelectProps<T = any> = Omit<
  ComponentPropsWithRef<"select">,
  "onChange"
> & {
  data: T[];
  itemText(d: T): ReactText;
  itemValue(d: T): ReactText;
  onChange?: (e: T) => void;
  wide?: boolean;
};
const StyledSelect = styled.select<{ wide?: boolean }>`
  ${sharedInputStyles};
  width: ${({ wide = false }) => (wide ? "100%" : "auto")};
`;
export const Select = styled((props: SelectProps) => {
  const {
    onChange = noOp,
    data,
    itemValue,
    itemText,
    placeholder = "Select an Item:",
    ...rest
  } = props;
  return (
    <StyledSelect
      disabled={!data.length}
      onInput={(e) => onChange(e.currentTarget.value)}
      {...rest}
    >
      {data.length > 0 && <option value="null">{placeholder}</option>}
      {data.map((d, i) => (
        <option key={i} value={itemValue(d)}>
          {itemText(d)}
        </option>
      ))}
      {data.length === 0 && <option value="null">No items to display</option>}
    </StyledSelect>
  );
})``;

export const Form = styled.form`
  margin: ${({ theme }) => theme.sizes.md} 0;
  max-width: 600px;
  text-align: left;
  width: 100%;

  @media screen and (max-width: 500px) {
    ${Select} {
      width: 100%;
    }
  }
`;

export const FormRow = styled(GridContainer)`
  place-content: space-between;
  gap: 4px;
  grid-template-columns: ${({ columns = "calc(50% - 2px) calc(50% - 2px)" }) =>
    columns};

  > * {
    margin: 0;
    width: 100%;
  }

  @media screen and (max-width: 570px) {
    grid-template-columns: 100%;
  }
`;

export const Controls = styled(FlexRow)`
  font-weight: bolder;
  margin: 0;
  place-content: space-between;

  > *,
  ${Input} {
    height: ${({ theme }) => theme.sizes.xxlg};
  }

  > * {
    flex-grow: 1;
    margin: 0;
    max-width: 33%;

    &:nth-child(even) {
      margin-left: ${({ theme }) => theme.sizes.sm};
      margin-right: ${({ theme }) => theme.sizes.sm};
    }
  }

  ${Input} {
    font-size: ${({ theme }) => theme.sizes.lg};
    font-weight: bold;
    text-align: center;
  }
`;
