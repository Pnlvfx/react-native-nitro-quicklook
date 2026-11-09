import type { EditedFileEvent } from './EditedFileEvent';
import type { SavedEditedCopyEvent } from './SavedEditedCopyEvent';

export type EmptyEvent = Record<string, never>;

export interface QuickLookEvents {
  onWillDismiss: EmptyEvent;
  onDismiss: EmptyEvent;
  onEditedFile: EditedFileEvent;
  onSavedEditedCopy: SavedEditedCopyEvent;
}
