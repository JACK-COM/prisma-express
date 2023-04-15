import styled from "styled-components";
import useGlobalNotifications from "hooks/GlobalNotifications";
import { FlexColumn } from "./Common/Containers";
import { AutoDismissNotification } from "./Common/Notifications";
import { Alert } from "state";

const NotificationGroup = styled(FlexColumn)`
  margin: 0 auto;
  max-width: 400px;
  overflow: hidden auto;
  padding: ${({ theme }) => theme.sizes.sm};
  pointer-events: none;
  position: fixed;
  right: 1rem;
  top: 1rem;
  width: 100%;
  z-index: 9999;

  ${AutoDismissNotification} {
    border-radius: ${({ theme }) => theme.presets.round.sm};
  }

  @media screen and (max-width: 600px) {
    bottom: 0;
    left: 0;
    margin: 0;
    max-width: 100%;
  }
`;

const ActiveNotifications = styled(() => {
  const { lastTenNotifications: msgs } = useGlobalNotifications();
  if (!msgs.length) return <></>;
  const timeout = (m: Alert) => (m.error ? 30000 : 5000);

  return (
    <NotificationGroup className="slide-in-right">
      {msgs.map((m) => (
        <AutoDismissNotification
          key={m.time}
          notification={m}
          timeout={timeout(m)}
        />
      ))}
    </NotificationGroup>
  );
})``;

export default ActiveNotifications;
