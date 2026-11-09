import { describe, expect, it, jest } from '@jest/globals';
import type { EditedFileEvent } from '../types/EditedFileEvent';
import type { SavedEditedCopyEvent } from '../types/SavedEditedCopyEvent';
import { createQuickLookListeners } from '../QuickLookListeners';

describe('createQuickLookListeners', () => {
  it('registers the native callback with the first subscriber only', () => {
    const { dismissRegistrations, listeners } = setup();

    listeners.addListener('onDismiss', jest.fn());
    listeners.addListener('onDismiss', jest.fn());

    expect(dismissRegistrations).toHaveLength(1);
  });

  it('clears the native callback when the last subscriber leaves', () => {
    const { callbacks, dismissRegistrations, listeners } = setup();
    const first = listeners.addListener('onDismiss', jest.fn());
    const second = listeners.addListener('onDismiss', jest.fn());

    first.remove();
    expect(dismissRegistrations).toHaveLength(1);
    expect(callbacks.dismiss).toBeDefined();

    second.remove();
    expect(dismissRegistrations).toHaveLength(2);
    expect(callbacks.dismiss).toBeUndefined();
  });

  it('delivers an empty payload for events without data', () => {
    const { callbacks, listeners } = setup();
    const listener = jest.fn();
    listeners.addListener('onWillDismiss', listener);

    callbacks.willDismiss?.();

    expect(listener).toHaveBeenCalledWith({});
  });

  it('delivers the edited file event to every subscriber', () => {
    const { callbacks, listeners } = setup();
    const first = jest.fn();
    const second = jest.fn();
    const event: EditedFileEvent = { filePath: '/documents/file.pdf' };
    listeners.addListener('onEditedFile', first);
    listeners.addListener('onEditedFile', second);

    callbacks.editedFile?.(event);

    expect(first).toHaveBeenCalledWith(event);
    expect(second).toHaveBeenCalledWith(event);
  });

  it('stops delivering events to a removed subscriber', () => {
    const { callbacks, listeners } = setup();
    const removed = jest.fn();
    const kept = jest.fn();
    const event: SavedEditedCopyEvent = { originalPath: '/documents/a.pdf', editedPath: '/documents/b.pdf' };
    const subscription = listeners.addListener('onSavedEditedCopy', removed);
    listeners.addListener('onSavedEditedCopy', kept);

    subscription.remove();
    callbacks.savedEditedCopy?.(event);

    expect(removed).not.toHaveBeenCalled();
    expect(kept).toHaveBeenCalledWith(event);
  });
});

const setup = () => {
  interface Callbacks {
    willDismiss?: (() => void) | undefined;
    dismiss?: (() => void) | undefined;
    editedFile?: ((event: EditedFileEvent) => void) | undefined;
    savedEditedCopy?: ((event: SavedEditedCopyEvent) => void) | undefined;
  }

  const callbacks: Callbacks = {};
  const dismissRegistrations: ((() => void) | undefined)[] = [];

  const listeners = createQuickLookListeners({
    setOnWillDismiss: (callback) => {
      callbacks.willDismiss = callback;
    },
    setOnDismiss: (callback) => {
      dismissRegistrations.push(callback);
      callbacks.dismiss = callback;
    },
    setOnEditedFile: (callback) => {
      callbacks.editedFile = callback;
    },
    setOnSavedEditedCopy: (callback) => {
      callbacks.savedEditedCopy = callback;
    },
  });

  return { callbacks, dismissRegistrations, listeners };
};
