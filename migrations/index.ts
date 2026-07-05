import * as migration_20260705_203424_initial from './20260705_203424_initial';

export const migrations = [
  {
    up: migration_20260705_203424_initial.up,
    down: migration_20260705_203424_initial.down,
    name: '20260705_203424_initial'
  },
];
