import styled from "styled-components";
import { FlexRow } from "./Containers";

const CenteredWrapper = styled(FlexRow)`
  color: ${({ theme }) => theme.colors.primary};
  place-content: center;
  height: 90vmin;
  width: 100vw;
`;

type LoaderProps = { msg?: string };
const FullScreenLoader = (props: LoaderProps) => {
  const { msg = "Loading route ..." } = props;
  return <CenteredWrapper>{msg}</CenteredWrapper>;
};
export default FullScreenLoader;
