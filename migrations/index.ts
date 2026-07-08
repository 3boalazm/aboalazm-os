import * as migration_20260705_212937_initial from './20260705_212937_initial';

export const migrations = [
  {
    up: migration_20260705_212937_initial.up,
    down: migration_20260705_212937_initial.down,
    name: '20260705_212937_initial'
  },
];
