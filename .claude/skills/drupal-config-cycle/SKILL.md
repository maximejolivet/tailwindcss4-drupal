---
name: drupal-config-cycle
description: Run the full Drupal configuration export/import/verify cycle using Lando-prefixed drush commands. Use after making config changes in the UI or when syncing config from another environment.
disable-model-invocation: false
---

When the user invokes /drupal-config-cycle or asks to do a config export/import cycle, guide them through the correct sequence.

## Export configuration (after UI changes)

Export active config to `config/sync/`:

```bash
lando drush config:export -y
```

Then verify what changed:

```bash
lando drush config:export --diff
```

Review the diff before committing — this shows exactly what Drupal's active config differs from the exported files.

## Import configuration (to apply committed config changes)

```bash
lando drush config:import -y
```

Then rebuild the cache to make sure all config is applied:

```bash
lando drush cache:rebuild
```

## Partial import (reset a single module's config)

To reset a specific module to its install config (e.g., after testing):

```bash
lando drush config:import --partial --source=web/modules/contrib/[module_name]/config/install
```

## Check a specific config value

```bash
lando drush config:get [config.name]
```

For example: `lando drush config:get system.site`

## Change a specific config value without UI

```bash
lando drush config:set [config.name] [key] [value]
```

## Common pitfalls

- Always export after making changes in the Drupal UI, otherwise the changes will be lost on the next `drush config:import`
- Always run `cache:rebuild` after importing — some config (like menu or block config) only takes effect after the cache is cleared
- If import fails with conflicts, check `lando drush config:export --diff` to see what's diverged
- Module install config lives in `config/install/` — changes there must also be reflected in the active config (see Best Practices in `.claude/CLAUDE.md`)
