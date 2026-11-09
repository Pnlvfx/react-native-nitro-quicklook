import type { QuickLook as NativeQuickLook } from './QuickLook.nitro';
import { NitroModules } from 'react-native-nitro-modules';
import { createQuickLookListeners } from './QuickLookListeners';

const native = NitroModules.createHybridObject<NativeQuickLook>('QuickLook');

const listeners = createQuickLookListeners(native);

const QuickLook = {
  previewFile: native.previewFile.bind(native),
  previewFiles: native.previewFiles.bind(native),
  canPreview: native.canPreview.bind(native),
  generateThumbnail: native.generateThumbnail.bind(native),
  addListener: listeners.addListener,
};

export default QuickLook;

export type { EditingMode } from './types/EditingMode';
export type { EditedFileEvent } from './types/EditedFileEvent';
export type { ListenerSubscription } from './types/ListenerSubscription';
export type { PreviewFileOptions } from './types/PreviewFileOptions';
export type { PreviewFilesOptions } from './types/PreviewFilesOptions';
export type { QuickLookEvents } from './types/QuickLookEvents';
export type { RequestOptions } from './types/RequestOptions';
export type { SavedEditedCopyEvent } from './types/SavedEditedCopyEvent';
export type { ThumbnailOptions } from './types/ThumbnailOptions';
export type { ThumbnailResult } from './types/ThumbnailResult';
export type { ThumbnailSize } from './types/ThumbnailSize';
