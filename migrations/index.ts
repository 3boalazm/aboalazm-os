import * as migration_20260705_212937_initial from './20260705_212937_initial';
import * as migration_20261024_145000_lead_pipeline from './20261024_145000_lead_pipeline';

export const migrations = [
  {
    up: migration_20260705_212937_initial.up,
    down: migration_20260705_212937_initial.down,
    name: '20260705_212937_initial'
  },
  {
    up: migration_20261024_145000_lead_pipeline.up,
    down: migration_20261024_145000_lead_pipeline.down,
    name: '20261024_145000_lead_pipeline'
  },
];
