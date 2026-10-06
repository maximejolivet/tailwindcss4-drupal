# Icon

Renders `<use href=".../dist/icons/sprite.svg#icon-{name}">`. New icons go into
`src/icons/sprite.svg` as a `<symbol id="icon-*">`; Vite's `publicDir: "src"`
copies the file to `dist/icons/sprite.svg` verbatim on every build, no extra
config needed. Add the new name to the `enum` in `icon.component.yml` so
`enforce_prop_schemas` catches typos at render time instead of failing silently.

## Props

| Prop       | Type                                    | Default | Notes |
| ---------- | ---------------------------------------- | ------- | ----- |
| name       | `arrow-right\|chevron-down\|check\|close` | —       | Required. |
| size       | `sm\|md\|lg`                             | `md`    | |
| decorative | `boolean`                                 | `true`  | `false` when the icon is the only content conveying meaning. |
| label      | `string\|null`                            | `null`  | Required (in practice) when `decorative: false`. |

## Usage

```twig
{# Decorative, next to a text label #}
{% include 'tailwind:icon' with { name: 'arrow-right' } %}

{# Meaningful on its own, e.g. inside an icon-only button #}
{% include 'tailwind:icon' with { name: 'close', decorative: false, label: 'Fermer'|t } %}
```
