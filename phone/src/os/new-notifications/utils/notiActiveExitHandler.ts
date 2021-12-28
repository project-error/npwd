import { getRecoil, setRecoil } from '../../../utils/RecoilPortal';
import { storedNotificationsFamily } from '../state/notifications.state';

// This is a pure function that takes no assumptions of the current context,
// meaning we can store it in Recoil without an issue.
export default function notiActiveExitHandler(_: HTMLElement, key: string | number) {
  if (typeof key === 'number') return;

  const tgtNoti = getRecoil(storedNotificationsFamily(key));

  if (!tgtNoti) {
    console.warn(`Uh oh, notification with key "${key}" was not found in Recoil Map.`);
  }

  setRecoil(storedNotificationsFamily(key), {
    ...tgtNoti,
    isActive: false,
  });
}
