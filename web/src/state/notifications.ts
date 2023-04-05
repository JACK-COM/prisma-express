import createState from "@jackcom/raphsducks";

/**
 * Your global application state `instance`. Every property in `initialState`
 * will become a method the state `instance`, so e.g. to update `appsCount`, you
 * call `store.appsCount( number )`. You can create as many state instances as
 * you need.
 */
export const Notifications = createState({
  all: [] as Alert[]
});

export type NotificationsStore = ReturnType<typeof Notifications.getState>;
export type NotificationsStoreKey = keyof NotificationsStore;
export type Alert = {
  msg: string;
  time: number;
  persistent?: boolean;
  error?: boolean;
};

export function addNotification(
  msg: string | Alert,
  persist = false,
  additional = {}
) {
  const note = (msg as Alert).time
    ? (msg as Alert)
    : createAlert(msg as string, persist);
  const { all: old } = Notifications.getState();
  const newAlerts = [...old, note];
  Notifications.multiple({ all: newAlerts, ...additional });
  return note.time;
}

export function resetNotifications(msg?: string, persist = false) {
  const updates = [];
  let msgId = null;
  if (msg) {
    const notification = createAlert(msg, persist);
    msgId = notification.time;
    updates.push(notification);
  }
  Notifications.all(updates);
  return msgId;
}

export function removeNotification(msg: Alert) {
  const { all: notifications } = Notifications.getState();
  const i = notifications.findIndex((n) => n.time === msg.time);
  if (i === -1) return;

  const updates = [...notifications];
  updates.splice(i, 1);
  Notifications.all(updates);
}

export function updateAsError(id: number | null, msg: string) {
  const { all: notifications } = Notifications.getState();
  const msgIndex = notifications.findIndex(({ time }) => time === id);
  const newAlert = createAlert(msg, true);
  const updates = [...notifications];
  newAlert.error = true;
  newAlert.persistent = false;
  if (id) newAlert.time = id as number;
  if (msgIndex === -1) updates.push(newAlert);
  else updates.splice(msgIndex, 1, newAlert);

  Notifications.all(updates);
}

export function updateNotification(
  id: number | null,
  msg: string,
  persist = false
) {
  const { all: notifications } = Notifications.getState();
  const i = notifications.findIndex(({ time }) => time === id);
  const newAlert = createAlert(msg, true);
  const updates = [...notifications];
  newAlert.time = id as number;
  newAlert.persistent = persist;
  if (i === -1) updates.push(newAlert);
  else updates.splice(i, 1, newAlert);

  Notifications.all(updates);
}

function createAlert(msg: string, persistent = false): Alert {
  return { msg, time: new Date().getTime(), persistent };
}
