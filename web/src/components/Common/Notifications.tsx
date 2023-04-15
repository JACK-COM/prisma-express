import React, { useEffect, useMemo, useState } from "react";
import { Alert, removeNotification } from "state";
import styled from "styled-components";
import { noOp } from "utils";
import { FlexRow } from "./Containers";

const Wrapper = styled(FlexRow)<{ error?: boolean }>`
  background-color: ${({ theme, error = false }) =>
    error ? theme.colors.error : theme.colors.accent};
  border-radius: ${({ theme }) => theme.presets.round.xs};
  box-shadow: 0 2px 4px #1118;
  height: minmax(3rem, 80px);
  margin-bottom: ${({ theme }) => theme.sizes.xs};
  pointer-events: all;
  width: 100%;

  .material-icons {
    background: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    display: inline-flex;
    margin-right: ${({ theme }) => theme.sizes.sm};
  }
`;

const ClearNotification = styled((p: NotificationProps) => (
  <button onClick={p.onClear} className="material-icons">
    close
  </button>
))<React.ComponentPropsWithRef<"button">>`
  color: ${({ theme }) => theme.colors.error};
`;

const Notification = styled((props: NotificationProps) => {
  const { error, notification, onClear = noOp } = props;
  const msg = useMemo(() => {
    if (typeof notification === "string") return notification;
    if ((notification as Alert).msg) return notification?.msg;
    return "";
  }, []);

  return (
    <Wrapper error={error} className={props.className} onClick={onClear}>
      <ClearNotification onClear={onClear} />
      <span>
        {error && <b className="label">Error:&nbsp;</b>} {msg}
      </span>
    </Wrapper>
  );
})``;

export default Notification;

export const AutoDismissNotification = styled((props: ADNProps) => {
  const { timeout = 5000, className, notification } = props;
  const [state, setState] = useState<ADNState>({
    timeout: null,
    class: `${className || ""} slide-in-left`
  });
  const clear = () => {
    if (state.timeout) clearTimeout(state.timeout as NodeJS.Timeout);
    removeNotification(props.notification as Alert);
  };
  const animate = () => {
    clearTimeout(state.timeout as NodeJS.Timeout);
    setState({ class: `${className || ""} slide-out-right` });
    setTimeout(clear, 500);
  };

  useEffect(() => {
    if (state.timeout !== null) return;
    setState({ timeout: setTimeout(animate, timeout) });
  }, [state.class]);

  return (
    <Notification
      onClear={clear}
      className={state.class}
      notification={notification.msg}
      error={notification.error}
    />
  );
})``;

type NotificationHandlers = {
  onClear(): void;
};

type NotificationBaseProps = {
  notification?: string | null | Alert;
  error?: boolean;
} & React.ComponentPropsWithRef<"div" | "section" | "button">;

type NotificationProps = NotificationBaseProps & NotificationHandlers;

type ADNProps = NotificationBaseProps & {
  notification: Alert;
  timeout?: number;
};

type ADNState = {
  timeout: NodeJS.Timeout | null;
  class: string;
} & any;
