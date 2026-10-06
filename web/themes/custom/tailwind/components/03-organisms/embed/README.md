# Embed

Maps onto the `embed` paragraph type. **Security note**: the `embed` slot is
printed unescaped (third-party markup can't survive Twig auto-escaping). The
paragraph field feeding it must use a restricted text format (no full HTML,
no script beyond what an explicit oEmbed/media allow-list permits) — never
point this at a plain textarea. This component does not add any sanitization
of its own; that boundary lives at the field/text-format level in Drupal, on
purpose, so it's auditable in one place (`filter.format.*` config) rather
than duplicated per component.

Sizing is intentionally minimal (`w-full`, no forced aspect ratio): most
oEmbed output from Drupal's media module already ships a responsive wrapper.
If a specific provider doesn't, fix it in the media source plugin, not here.

## Props

| Prop    | Type            | Default |
| ------- | ---------------- | ------- |
| caption | `string\|null`   | `null`  |

## Slots

`embed` — trusted embed markup.

## Usage

```twig
{% embed 'tailwind:embed' with { caption: 'Source : YouTube'|t } %}
  {% block embed %}{{ content.field_media }}{% endblock %}
{% endembed %}
```
