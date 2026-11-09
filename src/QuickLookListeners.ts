import type { QuickLook } from './QuickLook.nitro';
import type { ListenerSubscription } from './types/ListenerSubscription';
import type { EmptyEvent, QuickLookEvents } from './types/QuickLookEvents';

type Listener<TEvent> = (event: TEvent) => void;
type NativeRegister<TEvent> = (listener: Listener<TEvent> | undefined) => void;
type AddListener<TEvent> = (listener: Listener<TEvent>) => ListenerSubscription;

export const createQuickLookListeners = (
  native: Pick<QuickLook, 'setOnWillDismiss' | 'setOnDismiss' | 'setOnEditedFile' | 'setOnSavedEditedCopy'>,
) => {
  type Channels = { [TName in keyof QuickLookEvents]: AddListener<QuickLookEvents[TName]> };

  const channels: Channels = {
    onWillDismiss: createEventChannel<EmptyEvent>((listener) => {
      native.setOnWillDismiss(withEmptyPayload(listener));
    }),
    onDismiss: createEventChannel<EmptyEvent>((listener) => {
      native.setOnDismiss(withEmptyPayload(listener));
    }),
    onEditedFile: createEventChannel((listener) => {
      native.setOnEditedFile(listener);
    }),
    onSavedEditedCopy: createEventChannel((listener) => {
      native.setOnSavedEditedCopy(listener);
    }),
  };

  const addListener = <TName extends keyof QuickLookEvents>(eventName: TName, listener: Listener<QuickLookEvents[TName]>): ListenerSubscription =>
    channels[eventName](listener);

  return { addListener };
};

// Multi-subscriber channel bridging to a single native callback slot.
// The native callback is registered with the first subscriber and cleared when the last one leaves.
const createEventChannel = <TEvent>(registerOnNative: NativeRegister<TEvent>): AddListener<TEvent> => {
  const subscribers = new Set<Listener<TEvent>>();

  const aggregator = (event: TEvent): void => {
    for (const listener of subscribers) {
      listener(event);
    }
  };

  return (listener) => {
    if (subscribers.size === 0) {
      registerOnNative(aggregator);
    }
    subscribers.add(listener);
    return {
      remove: () => {
        subscribers.delete(listener);
        if (subscribers.size === 0) {
          registerOnNative(undefined);
        }
      },
    };
  };
};

const withEmptyPayload = (listener: Listener<EmptyEvent> | undefined): (() => void) | undefined => {
  if (listener === undefined) return undefined;
  return () => {
    listener({});
  };
};
