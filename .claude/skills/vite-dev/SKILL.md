---
name: vite-dev
description: Start Vite HMR dev mode for the Tailwind theme. Checks prerequisites (SSL certs, HMR setting, Lando), then starts the dev server.
disable-model-invocation: false
---

When the user invokes /vite-dev, guide them through starting the Vite dev server with HMR for this project.

## Step 1: Verify SSL certificates

Check that the mkcert certificates exist:

```bash
ls web/themes/custom/tailwind/plugins/https_key/
```

Expected files: `localhost.pem` and `localhost-key.pem`

If they're missing, explain: Vite uses HTTPS on port 3009. The certs must be generated with mkcert and placed at `web/themes/custom/tailwind/plugins/https_key/`. Run:

```bash
mkcert localhost
mv localhost.pem localhost-key.pem web/themes/custom/tailwind/plugins/https_key/
```

## Step 2: Verify HMR setting is enabled

Check `web/sites/default/settings.local.php` for:

```php
$settings['hot_module_replacement'] = TRUE;
```

If it's `FALSE` or missing, the theme will serve production assets from `dist/` even while Vite is running. The `tailwind_hmr` Drupal module reads this setting to inject the Vite client script into the page.

## Step 3: Verify Lando is running

```bash
lando list
```

If not running: `lando start`

## Step 4: Install theme dependencies (if needed)

If `web/themes/custom/tailwind/node_modules/` doesn't exist or is stale:

```bash
lando package
```

## Step 5: Start the Vite dev server

```bash
lando dev
```

The Vite dev server listens at `https://localhost:3009`. Open the site at https://tailwind.lndo.site — changes to CSS/JS files in `web/themes/custom/tailwind/src/` will hot-reload automatically.

## Step 6: Confirm HMR is active

In the browser console, you should see:
```
[vite] connecting...
[vite] connected.
```

If you see errors about the certificate or connection refused, recheck Steps 1–2.

## When done / switching to production

Set the HMR setting back to `FALSE` and run `lando build` to compile production assets into `dist/`.
