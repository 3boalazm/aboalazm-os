import * as migration_20260705_212937_initial from './20260705_212937_initial';
import * as migration_20261024_145000_lead_pipeline from './20261024_145000_lead_pipeline';
import * as migration_20261111_120000_messages_locale_ms from './20261111_120000_messages_locale_ms';
import * as migration_20261112_100000_analytics_events from './20261112_100000_analytics_events';
import * as migration_20261119_130000_session_registrations from './20261119_130000_session_registrations';
import * as migration_20261122_180000_session_feedback from './20261122_180000_session_feedback';

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
  {
    up: migration_20261111_120000_messages_locale_ms.up,
    down: migration_20261111_120000_messages_locale_ms.down,
    name: '20261111_120000_messages_locale_ms'
  },
  {
    up: migration_20261112_100000_analytics_events.up,
    down: migration_20261112_100000_analytics_events.down,
    name: '20261112_100000_analytics_events'
  },
  {
    up: migration_20261119_130000_session_registrations.up,
    down: migration_20261119_130000_session_registrations.down,
    name: '20261119_130000_session_registrations'
  },
  {
    up: migration_20261122_180000_session_feedback.up,
    down: migration_20261122_180000_session_feedback.down,
    name: '20261122_180000_session_feedback'
  }
];
