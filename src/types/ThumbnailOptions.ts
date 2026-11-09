import type { ThumbnailSize } from './ThumbnailSize';

export interface ThumbnailOptions {
  /** Local file path or `file://` uri. Remote urls are not supported, download the file first. */
  uri: string;
  size: ThumbnailSize;
  /** Pixel density. Defaults to the device scale. */
  scale?: number;
}
