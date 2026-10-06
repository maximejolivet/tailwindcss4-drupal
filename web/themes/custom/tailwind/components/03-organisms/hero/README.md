# Hero

Page/section banner. `heading_level` is capped to `1|2` in the schema (not the
full 1–6 range) because a hero is either the page's single `h1` or a
sub-section `h2` — anything else is a modelling mistake this schema catches
at render time via `enforce_prop_schemas`.

## Props

| Prop           | Type              | Default   | Notes |
| -------------- | ------------------ | --------- | ----- |
| variant        | `default\|centered` | `default` | |
| heading_level  | `1\|2`             | `1`       | `1` for the page hero, `2` for an in-page section hero. |

## Slots

| Slot     | Required | Notes |
| -------- | -------- | ----- |
| title    | no       | Wrapped in `tailwind:heading` size `hero`. |
| subtitle | no       | |
| media    | no       | Background image/video; adds a scrim and switches text to inverse tokens. |
| cta      | no       | One or more `tailwind:button`. |

## Usage

```twig
{% embed 'tailwind:hero' with { variant: 'default', heading_level: 1 } %}
  {% block title %}{{ 'Bienvenue'|t }}{% endblock %}
  {% block subtitle %}{{ 'Un sous-titre court.'|t }}{% endblock %}
  {% block media %}{{ content.field_media }}{% endblock %}
  {% block cta %}
    {% embed 'tailwind:button' with { variant: 'primary', size: 'lg', url: '/contact' } %}
      {% block content %}{{ 'Nous contacter'|t }}{% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

This is the component the `hero` paragraph type maps onto — see
`templates/paragraph/paragraph--hero.html.twig`, which does nothing but this
mapping (mission constraint 7c: paragraph templates are pure mapping, zero
structural HTML).
