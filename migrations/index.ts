import * as migration_20260705_212937_initial from './20260705_212937_initial';
import * as migration_20260708_205022_add_uiux_fields from './20260708_205022_add_uiux_fields';

export const migrations = [
  {
    up: migration_20260705_212937_initial.up,
    down: migration_20260705_212937_initial.down,
    name: '20260705_212937_initial',
  },
  {
    up: migration_20260708_205022_add_uiux_fields.up,
    down: migration_20260708_205022_add_uiux_fields.down,
    name: '20260708_205022_add_uiux_fields'
  },
];
