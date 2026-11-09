# react-native-nitro-quicklook

Quick Look file thumbnails for React Native, built on Nitro Modules.

Renders the first page of PDFs, Office documents, text files, images and anything else `QLThumbnailGenerator` supports into a cached PNG.

## Usage

```ts
import { PixelRatio } from 'react-native';
import { QuickLook } from 'react-native-nitro-quicklook';

const { uri, width, height } = await QuickLook.generateThumbnail({
  uri: 'file:///path/to/report.pdf',
  width: 78,
  height: 78,
  scale: PixelRatio.get(),
});
```

- Only local files are supported, download remote files first.
- Results are cached in the app caches directory, keyed by path, modification date, size and requested dimensions. The OS may evict them at any time.
- Files Quick Look cannot render reject the promise, so callers can fall back to a file icon.

## Platforms

- iOS: implemented with `QLThumbnailGenerator`.
- Android: stub, every call rejects.
