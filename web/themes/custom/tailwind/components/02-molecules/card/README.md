# Card

Composes `tailwind:heading` for the title. When `url` is set, the whole card
is clickable via the stretched-link pattern (`absolute inset-0` span inside
the title link) — the `footer` slot is raised with `relative z-10` so buttons
or links placed there stay individually clickable above the stretched link.

`variant: horizontal` is what `node--article--teaser.html.twig` maps onto, and
what the `text_media` paragraph type embeds (see
`templates/paragraph/paragraph--text-media.html.twig`).

## Props

| Prop           | Type                    | Default    | Notes |
| -------------- | ------------------------ | ---------- | ----- |
| variant        | `vertical\|horizontal`   | `vertical` | |
| url            | `string\|null`           | `null`     | Makes the whole card clickable. |
| heading_level  | `2\|3\|4\|5\|6`          | `3`        | Passed to the internal heading — set to match the card's position in the page outline. |
| image_position | `start\|end`             | `start`    | Horizontal variant only. Driven by the `text_media` paragraph's `field_position` (gauche/droite). |

## Slots

| Slot    | Required | Notes |
| ------- | -------- | ----- |
| image   | no       | Media markup (responsive image, picture). |
| title   | no       | Wrapped in `tailwind:heading`. |
| content | no       | Body/summary. |
| footer  | no       | Meta row or CTA — kept above the stretched link (`z-10`). |

## Usage

```twig
{% embed 'tailwind:card' with { variant: 'horizontal', url: node_url, heading_level: 2 } %}
  {% block image %}{{ content.field_image }}{% endblock %}
  {% block title %}{{ node.label }}{% endblock %}
  {% block content %}{{ node.body.summary }}{% endblock %}
  {% block footer %}
    {% include 'tailwind:badge' with { variant: 'neutral' } %}
  {% endblock %}
{% endembed %}
```
