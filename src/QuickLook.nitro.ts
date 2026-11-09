import type { HybridObject } from 'react-native-nitro-modules';
import type { EditedFileEvent } from './types/EditedFileEvent';
import type { PreviewFileOptions } from './types/PreviewFileOptions';
import type { PreviewFilesOptions } from './types/PreviewFilesOptions';
import type { SavedEditedCopyEvent } from './types/SavedEditedCopyEvent';
import type { ThumbnailOptions } from './types/ThumbnailOptions';
import type { ThumbnailResult } from './types/ThumbnailResult';

export interface QuickLook extends HybridObject<{
  ios: 'swift';
  android: 'kotlin';
}> {
  previewFile(options: PreviewFileOptions): Promise<void>;
  previewFiles(options: PreviewFilesOptions): Promise<void>;
  canPreview(uri: string): Promise<boolean>;
  generateThumbnail(options: ThumbnailOptions): Promise<ThumbnailResult>;
  setOnWillDismiss(callback: (() => void) | undefined): void;
  setOnDismiss(callback: (() => void) | undefined): void;
  setOnEditedFile(callback: ((event: EditedFileEvent) => void) | undefined): void;
  setOnSavedEditedCopy(callback: ((event: SavedEditedCopyEvent) => void) | undefined): void;
}
