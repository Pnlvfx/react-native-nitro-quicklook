import { execa } from 'execa';
import path from 'node:path';

const resetWatchman = async (directory: string) => {
  // eslint-disable-next-line parallelize/no-sequential-await -- watch-project must run after watch-del
  await execa('watchman', ['watch-del', directory], { stdio: 'inherit' });
  await execa('watchman', ['watch-project', directory], { stdio: 'inherit' });
};

const rootDir = path.resolve(import.meta.dirname, '..', '..');
const exampleDir = path.join(rootDir, 'example');

// eslint-disable-next-line parallelize/no-sequential-await -- Metro must start after the watchman reset
await Promise.all([resetWatchman(rootDir), resetWatchman(exampleDir)]);

await execa('node_modules/.bin/react-native', ['start'], { stdio: 'inherit' });
