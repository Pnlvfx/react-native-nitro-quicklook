import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import QuickLook from 'react-native-nitro-quicklook';

const sampleUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const App = () => {
  const [status, setStatus] = useState('Idle');

  const run = async (label: string, action: () => Promise<string>) => {
    try {
      setStatus(`${label}: ${await action()}`);
    } catch (error) {
      setStatus(`${label} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const onPreviewFile = () => {
    void run('previewFile', previewRemoteFile);
  };

  const onPreviewFiles = () => {
    void run('previewFiles', previewRemoteFiles);
  };

  const onCanPreview = () => {
    void run('canPreview', canPreviewRemoteFile);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{'Nitro QuickLook'}</Text>
      <Button onPress={onPreviewFile} title="previewFile (remote pdf)" />
      <Button onPress={onPreviewFiles} title="previewFiles (remote pdf x2)" />
      <Button onPress={onCanPreview} title="canPreview (remote pdf)" />
      <Text style={styles.status} testID="status">
        {status}
      </Text>
    </ScrollView>
  );
};

export default App;

const previewRemoteFile = async () => {
  await QuickLook.previewFile({ uri: sampleUrl });
  return 'dismissed';
};

const previewRemoteFiles = async () => {
  await QuickLook.previewFiles({ uris: [sampleUrl, sampleUrl] });
  return 'dismissed';
};

const canPreviewRemoteFile = async () => {
  const supported = await QuickLook.canPreview(sampleUrl);
  return supported.toString();
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', gap: 16, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  status: { fontSize: 14, textAlign: 'center' },
});
