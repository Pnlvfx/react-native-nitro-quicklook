import type { ThumbnailResult } from 'react-native-nitro-quicklook';
import blobUtil from 'react-native-blob-util';
import QuickLook from 'react-native-nitro-quicklook';

const sampleUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export const previewRemoteFile = async () => {
  await QuickLook.previewFile({ uri: sampleUrl });
  return 'dismissed';
};

export const previewRemoteFiles = async () => {
  await QuickLook.previewFiles({ uris: [sampleUrl, sampleUrl] });
  return 'dismissed';
};

export const canPreviewRemoteFile = async () => {
  const supported = await QuickLook.canPreview(sampleUrl);
  return supported.toString();
};

export const previewLocalFile = async () => {
  const path = await ensureLocalFile();
  await QuickLook.previewFile({ uri: `file://${path}` });
  return 'dismissed';
};

export const previewEditableFile = async () => {
  const path = await ensureLocalFile();
  await QuickLook.previewFile({ uri: path, editingMode: 'createCopy' });
  return 'dismissed';
};

export const generateLocalThumbnail = async (): Promise<ThumbnailResult> => {
  const path = await ensureLocalFile();
  return QuickLook.generateThumbnail({ uri: `file://${path}`, size: { width: 120, height: 160 } });
};

const ensureLocalFile = async () => {
  const path = `${blobUtil.fs.dirs.DocumentDir}/sample.pdf`;
  if (await blobUtil.fs.exists(path)) return path;
  const response = await blobUtil.config({ path }).fetch('GET', sampleUrl);
  return response.path();
};
