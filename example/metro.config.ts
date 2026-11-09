import path from 'node:path';
import { getDefaultConfig } from '@react-native/metro-config';
/** @ts-expect-error idk man, ok. */
import { withMetroConfig } from 'react-native-monorepo-config';

const root = path.resolve(import.meta.dirname, '..');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const config = withMetroConfig(getDefaultConfig(import.meta.dirname), {
  root,
  dirname: import.meta.dirname,
  resetCache: true,
});

export default config;
