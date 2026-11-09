import type { EditingMode } from './EditingMode';
import type { RequestOptions } from './RequestOptions';

export interface PreviewFilesOptions {
  /** Local file paths, `file://` uris or `http(s)` urls. */
  uris: string[];
  requestOptions?: RequestOptions;
  /** Index of the file shown first. Defaults to 0. */
  initialIndex?: number;
  /** iOS only. Defaults to `disabled`. */
  editingMode?: EditingMode;
}
