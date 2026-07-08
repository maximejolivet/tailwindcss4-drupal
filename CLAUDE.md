# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment

All commands run through **Lando** — never bare `drush`, `composer`, or `npm` directly.

- Start environment: `lando start`
- Site URL: https://tailwind.lndo.site
- Drush: `lando drush <cmd>`
- Composer: `lando composer <cmd>`
- Node/npm: `lando npm <cmd>`

The project requires a `.env` file at the root (see `.env.example`). Key vars: `VITE_SERVER_ORIGIN`, `VITE_SERVER_HOST`, `VITE_SERVER_PORT` (default 3009).

> Note: `.claude/CLAUDE.md` covers Drupal/PHP conventions, config management, coding standards, and drush commands in detail.

## Project Structure

- **Custom theme**: `web/themes/custom/tailwind/` — Drupal theme powered by Vite + TailwindCSS 4
- **HMR module**: `web/modules/custom/tailwind_hmr/` — custom module that injects Vite client for Hot Module Replacement
- **Config**: `config/sync/` — Drupal configuration sync directory

## Frontend Theme Workflow

Install theme dependencies (required once after `git clone` or dependency updates):

```bash
lando package   # equivalent to: npm --prefix web/themes/custom/tailwind install
```

Start development (Vite dev server with HMR):

```bash
lando dev       # equivalent to: npm --prefix web/themes/custom/tailwind run dev
```

Build for production:

```bash
lando build     # equivalent to: npm --prefix web/themes/custom/tailwind run build
```

Format JS/CSS with Prettier:

```bash
lando npm --prefix web/themes/custom/tailwind run prettier
```

Build output goes to `web/themes/custom/tailwind/dist/` (organized into `css/`, `js/`, `images/`, `fonts/`).

## Vite Dev Server / HMR Setup

Vite runs on HTTPS (port 3009). **SSL certificates are required** at:

```
web/themes/custom/tailwind/plugins/https_key/localhost.pem
web/themes/custom/tailwind/plugins/https_key/localhost-key.pem
```

Generate them with mkcert locally, then copy into that directory.

HMR is controlled by a Drupal setting in `web/sites/default/settings.local.php`:

```php
$settings['hot_module_replacement'] = TRUE;  // enable dev mode
$settings['hot_module_replacement'] = FALSE; // use production build
```

When HMR is enabled, the `tailwind_hmr` module injects the Vite client and dev CSS. When disabled, production assets from `dist/` are served.

## TailwindCSS v4

This project uses TailwindCSS **v4** which has a different configuration approach:

- **No `tailwind.config.js`** — theme tokens are defined inside the CSS file using `@theme {}` blocks
- CSS entry point: `web/themes/custom/tailwind/src/css/tailwind.css`
- Colors use OKLCH format (e.g., `oklch(0.488 0.217 264.376)`)
- Custom utilities defined with `@utility` directive, not `@layer utilities`
- Custom fonts (Luciole family) included in `src/fonts/` and referenced via `@theme`

When modifying the theme's CSS or adding new Tailwind utilities, always use v4 syntax.

## Branch Conventions

Use `feature/short-description` for new work, `fix/short-description` for bug fixes.

## Drupal Coding Standards (reminder)

PHP files must follow Drupal coding standards: 2-space indentation, 120-char line limit, PHPDoc on all classes and methods, PSR-4 namespaces (`Drupal\{module_name}`). See `.claude/CLAUDE.md` for full details.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
