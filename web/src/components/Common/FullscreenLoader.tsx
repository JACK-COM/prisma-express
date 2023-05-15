import styled from "styled-components";
import { FlexRow } from "./Containers";

const CenteredWrapper = styled(FlexRow)`
  color: ${({ theme }) => theme.colors.primary};
  height: 100vh;
  left: 0;
  place-content: center;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: 100vw;
`;

type LoaderProps = { msg?: string };
const FullScreenLoader = (props: LoaderProps) => {
  const { msg = "Loading route ..." } = props;
  return <CenteredWrapper>{msg}</CenteredWrapper>;
};
export default FullScreenLoader;
