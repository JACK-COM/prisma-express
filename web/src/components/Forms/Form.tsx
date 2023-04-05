import { FlexRow, GridContainer } from "components/Common/Containers";
import { ComponentPropsWithRef } from "react";
import styled, { css } from "styled-components";

type ReactText = string | number;
const sharedInputStyles = css`
  border-radius: ${({ theme }) => theme.presets.rounded.sm};
  font-size: 16px;
  height: ${({ theme }) => theme.sizes.lg};
  line-height: ${({ theme }) => theme.sizes.lg};
  padding: ${({ theme }) => theme.sizes.xs};
`;
const sharedRadioStyles = css`
  display: inline-block;
  margin: 0 0.3rem;
  order: -1;
  width: initial;
`;
export const Fieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.semitransparent};
  border-radius: ${({ theme }) => theme.presets.rounded.sm};
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
  display: flex;
  flex-direction: ${({ direction = "column" }) => direction};

  > span,
  .label {
    color: #e89458;
    font-weight: bold;
  }
`;
export const RadioInput = styled.input.attrs({ type: "radio" })`
  ${sharedRadioStyles}
`;
export const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  ${sharedRadioStyles}
`;
export const RadioLabel = styled(Label)`
  align-items: center;
  display: grid;
  gap: 0.33rem;
  grid-template-columns: min-content auto;

  ${RadioInput} {
    margin-right: 0.4rem;
    width: initial;
  }
`;
export const Legend = styled.legend`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.sizes.md};
  font-weight: 600;
  line-height: ${({ theme }) => theme.sizes.md};

  &::after {
    content: "*";
    display: ${(props) => (props["aria-required"] ? "inline-block" : "none")};
    color: ${({ theme }) => theme.colors.error};
    font-size: 2rem;
  }
`;
export const Hint = styled.div`
  font-size: ${({ theme }) => theme.sizes.sm};
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

type SelectProps = ComponentPropsWithRef<"select"> & {
  data: any[];
  itemText(d: any): ReactText;
  itemValue(d: any): ReactText;
};
const SelectDropdown = styled.select`
  ${sharedInputStyles};
`;
export const Select = styled((props: SelectProps) => {
  const {
    onChange,
    data,
    itemValue,
    itemText,
    placeholder = "Select an Item:",
    ...rest
  } = props;
  return (
    <SelectDropdown disabled={!data.length} onInput={onChange} {...rest}>
      {data.length > 0 && <option value="null">{placeholder}</option>}
      {data.map((d, i) => (
        <option key={i} value={itemValue(d)}>
          {itemText(d)}
        </option>
      ))}
      {data.length === 0 && <option value="null">No items to display</option>}
    </SelectDropdown>
  );
})``;

export const WideSelect = styled(Select)`
  width: 100%;
`;

export const Form = styled.form`
  margin: ${({ theme }) => theme.sizes.md} 0;
  max-width: 600px;
  text-align: left;
  width: 100%;

  @media screen and (max-width: 500px) {
    ${Select},${WideSelect} {
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
