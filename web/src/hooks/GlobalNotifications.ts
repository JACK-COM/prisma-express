import { useEffect, useState } from "react";
import { Notifications, NotificationsStore } from "state";

/**
 * Listen to notifications/`Alerts`. Mainly used by `ActiveNotification` component
 * @returns Last ten notifications published to app`
 */
export default function useGlobalNotifications() {
  const { all, active } = Notifications.getState();
  const [msgs, setMsgs] = useState([...all]);
  const onNotification = (n: Partial<NotificationsStore>) => {
    if (!Array.isArray(n.all)) return;
    const newnotes = n.all.slice(-10);
    setMsgs(newnotes);
  };

  useEffect(() => Notifications.subscribe(onNotification), []);

  return { lastTenNotifications: msgs, all, active };
}
