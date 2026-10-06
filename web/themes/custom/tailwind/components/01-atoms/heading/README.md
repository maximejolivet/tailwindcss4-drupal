# Heading

Twig can't build a tag name dynamically (`<h{{ level }}>` isn't valid), so the
template is an if/elseif chain over `level`. `level` and `size` are separate
props on purpose: an `<h2>` in a card grid can be styled as large as a page
`<h1>` without lying to the document outline or screen readers.

## Props

| Prop  | Type      | Default | Notes                          |
| ----- | --------- | ------- | -------------------------------- |
| level | `1..6`    | —       | Required. Semantic, drives the outline. |
| size  | `xs\|sm\|md\|lg\|xl\|2xl\|3xl\|hero` | `md` | Visual only. |

## Slots

| Slot    | Required | Notes         |
| ------- | -------- | -------------- |
| content | yes      | Heading text.  |

## Usage

```twig
{# Page title override — see templates/content/page-title.html.twig #}
{% embed 'tailwind:heading' with { level: 1, size: '3xl', attributes: title_attributes } %}
  {% block content %}{{ title }}{% endblock %}
{% endembed %}

{# A card title that must stay an h3 in the outline but read small #}
{% embed 'tailwind:heading' with { level: 3, size: 'sm' } %}
  {% block content %}{{ 'En savoir plus'|t }}{% endblock %}
{% endembed %}
```
