# Accordion item

Single disclosure entry built on native `<details>/<summary>`. Always used
inside [Accordion](../../03-organisms/accordion/README.md), never standalone
in a paragraph template.

## Slots

| Slot    | Required | Notes |
| ------- | -------- | ----- |
| title   | yes      | Always-visible summary. |
| content | yes      | Revealed on expand. |

## Usage

```twig
{% embed 'tailwind:accordion-item' %}
  {% block title %}{{ 'Livraison'|t }}{% endblock %}
  {% block content %}{{ 'Sous 48h ouvrées.'|t }}{% endblock %}
{% endembed %}
```
