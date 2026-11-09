import type { EditingMode } from './EditingMode';
import type { RequestOptions } from './RequestOptions';

export interface PreviewFileOptions {
  /** Local file path, `file://` uri or `http(s)` url. Remote files are downloaded before previewing. */
  uri: string;
  requestOptions?: RequestOptions;
  /** Android only. Title of the app chooser. */
  chooserTitle?: string;
  /** iOS only. Defaults to `disabled`. */
  editingMode?: EditingMode;
}
