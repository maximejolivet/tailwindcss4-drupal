# Badge

Static status indicator. For a chip the editor can remove or click, use
[Tag](../tag/README.md) instead.

## Props

| Prop    | Type                                          | Default   |
| ------- | ---------------------------------------------- | --------- |
| variant | `neutral\|primary\|success\|warning\|danger\|info` | `neutral` |
| size    | `sm\|md`                                       | `md`      |

## Slots

| Slot    | Required | Notes        |
| ------- | -------- | ------------- |
| content | yes      | Text or count. |

## Usage

```twig
{% embed 'tailwind:badge' with { variant: 'success' } %}
  {% block content %}{{ 'Publié'|t }}{% endblock %}
{% endembed %}
```
