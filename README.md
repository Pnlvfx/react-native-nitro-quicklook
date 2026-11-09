# react-native-nitro-quicklook

Quick Look previews and thumbnails for React Native, built on Nitro Modules.

The API mirrors `@magrinj/expo-quick-look`, so you can move between the two with minimal changes.

## Installation

```sh
npm install react-native-nitro-quicklook react-native-nitro-modules
```

On iOS, run `pod install` afterwards. On Android the library's `AndroidManifest.xml` registers a `FileProvider` and a `VIEW` intent query automatically.

## Usage

```ts
import QuickLook from 'react-native-nitro-quicklook';

await QuickLook.previewFile({ uri: 'file:///path/to/report.pdf' });

await QuickLook.previewFile({
  uri: 'https://example.com/report.pdf',
  requestOptions: { headers: { Authorization: 'Bearer token' } },
});

await QuickLook.previewFiles({
  uris: ['file:///path/to/a.pdf', 'file:///path/to/b.pdf'],
  initialIndex: 1,
});

const supported = await QuickLook.canPreview('file:///path/to/report.pdf');

const { uri, width, height } = await QuickLook.generateThumbnail({
  uri: 'file:///path/to/report.pdf',
  size: { width: 78, height: 78 },
});
```

## API

### `previewFile(options)`

Opens a single file. Remote `http(s)` urls are downloaded first. The promise resolves when the preview is dismissed on iOS, and once the viewer app is launched on Android.

| Option           | Type                                         | Notes                                                    |
| ---------------- | -------------------------------------------- | -------------------------------------------------------- |
| `uri`            | `string`                                     | Local path, `file://` uri or `http(s)` url.              |
| `requestOptions` | `{ headers?: Record<string, string> }`       | Headers used when downloading a remote file.             |
| `chooserTitle`   | `string`                                     | Android only. Title of the app chooser.                  |
| `editingMode`    | `'disabled' \| 'createCopy' \| 'updateContents'` | iOS only. Defaults to `disabled`.                    |

### `previewFiles(options)`

Opens several files in one Quick Look session. iOS only, rejects on Android.

| Option           | Type                                         | Notes                                      |
| ---------------- | -------------------------------------------- | ------------------------------------------ |
| `uris`           | `string[]`                                   | Local paths, `file://` uris or `http(s)` urls. |
| `requestOptions` | `{ headers?: Record<string, string> }`       | Headers used for remote downloads.         |
| `initialIndex`   | `number`                                     | File shown first. Defaults to `0`.         |
| `editingMode`    | `'disabled' \| 'createCopy' \| 'updateContents'` | Defaults to `disabled`.                |

### `canPreview(uri)`

Resolves to `true` when the file can be previewed. On Android this checks that an installed app can handle the file's MIME type.

### `generateThumbnail(options)`

Renders the first page of a file into a cached PNG. iOS only, rejects on Android.

- `uri`: local path or `file://` uri. Remote urls are not supported, download the file first.
- `size`: `{ width, height }` in points.
- `scale`: pixel density, defaults to the device scale.

Resolves to `{ uri, width, height }`, where `uri` is a `file://` uri of a PNG in the app caches directory and `width` and `height` are in pixels. The OS may evict the cache at any time. Files Quick Look cannot render reject the promise, so callers can fall back to a file icon.

### `addListener(eventName, listener)`

Returns a subscription with a `remove()` method.

| Event              | Payload                                       |
| ------------------ | --------------------------------------------- |
| `onWillDismiss`    | `{}`                                          |
| `onDismiss`        | `{}`                                          |
| `onEditedFile`     | `{ filePath: string }`                        |
| `onSavedEditedCopy`| `{ originalPath: string, editedPath: string }`|

```ts
const subscription = QuickLook.addListener('onDismiss', () => {
  console.log('preview closed');
});

subscription.remove();
```

## Platform support

| Feature                          | iOS | Android                  |
| -------------------------------- | --- | ------------------------ |
| `previewFile`                    | Yes | Opens an app chooser     |
| `previewFiles`                   | Yes | Rejects                  |
| `canPreview`                     | Yes | Yes                      |
| `generateThumbnail`              | Yes | Rejects                  |
| `editingMode`                    | Yes | Ignored                  |
| Listeners                        | Yes | Never fire               |
| Remote files with headers        | Yes | Yes                      |
