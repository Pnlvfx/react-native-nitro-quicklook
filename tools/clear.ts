import { execa } from 'execa';
import { rimraf } from '@goatjs/rimraf';
import path from 'node:path';

// eslint-disable-next-line parallelize/no-sequential-await -- clean needs node_modules, which is removed right after
await execa('pnpm', ['clean']);
await rimraf(['node_modules', path.join('example', 'node_modules'), 'pnpm-lock.yaml', path.join('android', 'build')]);
