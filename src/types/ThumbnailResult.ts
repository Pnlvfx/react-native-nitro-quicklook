export interface ThumbnailResult {
  /** `file://` uri of a PNG inside the app cache, the OS may evict it at any time. */
  uri: string;
  /** Actual width in pixels. */
  width: number;
  /** Actual height in pixels. */
  height: number;
}
