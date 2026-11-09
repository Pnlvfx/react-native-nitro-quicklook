import { useState } from 'react';
// eslint-disable-next-line no-restricted-imports -- @rn-ui/primitives is not available in this example
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import {
  canPreviewRemoteFile,
  generateLocalThumbnail,
  previewEditableFile,
  previewLocalFile,
  previewRemoteFile,
  previewRemoteFiles,
} from './actions';
import { ActionButton } from './ActionButton';
import { useQuickLookEvent } from './useQuickLookEvent';

const App = () => {
  const [status, setStatus] = useState('Idle');
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const lastEvent = useQuickLookEvent();

  const run = async (label: string, action: () => Promise<string>) => {
    try {
      setStatus(`${label}: ${await action()}`);
    } catch (error) {
      setStatus(`${label} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateThumbnail = async () => {
    const { uri, width, height } = await generateLocalThumbnail();
    setThumbnailUri(uri);
    return `${width.toString()}x${height.toString()}`;
  };

  const actions = [
    { label: 'previewFile', title: 'previewFile (remote pdf)', action: previewRemoteFile },
    { label: 'previewFiles', title: 'previewFiles (remote pdf x2)', action: previewRemoteFiles },
    { label: 'canPreview', title: 'canPreview (remote pdf)', action: canPreviewRemoteFile },
    { label: 'previewLocal', title: 'previewFile (local pdf)', action: previewLocalFile },
    { label: 'previewEditable', title: 'previewFile (local, createCopy)', action: previewEditableFile },
    { label: 'generateThumbnail', title: 'generateThumbnail (local pdf)', action: generateThumbnail },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{'Nitro QuickLook'}</Text>
      {actions.map(({ label, title, action }) => (
        <ActionButton action={action} key={label} label={label} run={run} title={title} />
      ))}
      <Text style={styles.status} testID="status">
        {status}
      </Text>
      <Text style={styles.status} testID="event">
        {lastEvent}
      </Text>
      {thumbnailUri ? <Image accessibilityIgnoresInvertColors source={{ uri: thumbnailUri }} style={styles.thumbnail} testID="thumbnail" /> : undefined}
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', gap: 16, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  status: { fontSize: 14, textAlign: 'center' },
  thumbnail: { alignSelf: 'center', width: 120, height: 160 },
});
