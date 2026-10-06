# CTA banner

Maps onto the `cta_banner` paragraph type.

## Props

| Prop          | Type              | Default   |
| ------------- | ------------------ | --------- |
| variant       | `primary\|secondary` | `primary` |
| heading_level | `2\|3`             | `2`       |

## Slots

`title`, `content`, `cta` (one or more `tailwind:button`).

## Usage

```twig
{% embed 'tailwind:cta-banner' with { variant: 'primary', heading_level: 2 } %}
  {% block title %}{{ 'Prêt à démarrer ?'|t }}{% endblock %}
  {% block content %}{{ 'Parlons de votre projet.'|t }}{% endblock %}
  {% block cta %}
    {% embed 'tailwind:button' with { variant: 'secondary', url: '/contact' } %}
      {% block content %}{{ 'Contact'|t }}{% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```
