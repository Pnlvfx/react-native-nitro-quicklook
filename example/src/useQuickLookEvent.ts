import type { QuickLookEvents } from 'react-native-nitro-quicklook';
import { useEffect, useState } from 'react';
import QuickLook from 'react-native-nitro-quicklook';

export const useQuickLookEvent = () => {
  const [lastEvent, setLastEvent] = useState('No events');

  // Subscribe to every Quick Look event and keep the latest one for display.
  useEffect(() => {
    const subscriptions = eventNames.map((name) =>
      QuickLook.addListener(name, (event) => {
        setLastEvent(`${name}: ${JSON.stringify(event)}`);
      }),
    );
    return () => {
      for (const subscription of subscriptions) {
        subscription.remove();
      }
    };
  }, []);

  return lastEvent;
};

const eventNames = ['onWillDismiss', 'onDismiss', 'onEditedFile', 'onSavedEditedCopy'] satisfies (keyof QuickLookEvents)[];
