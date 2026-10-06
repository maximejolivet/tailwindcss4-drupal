# Tag

Interactive chip — a filter link or removable selection. Embeds `tailwind:icon`
for the close glyph when `removable: true`. Not a form widget: removal
behaviour (submitting the form, dispatching a JS event) is wired up by
whatever consumes this component, the SDC stays presentation-only.

## Props

| Prop      | Type              | Default   |
| --------- | ------------------ | --------- |
| variant   | `neutral\|primary` | `neutral` |
| url       | `string\|null`      | `null`    |
| removable | `boolean`           | `false`   |

## Slots

| Slot    | Required | Notes       |
| ------- | -------- | ------------ |
| content | yes      | Tag label.   |

## Usage

```twig
{# Taxonomy term link #}
{% embed 'tailwind:tag' with { url: term_url } %}
  {% block content %}{{ term_label }}{% endblock %}
{% endembed %}

{# Removable filter chip #}
{% embed 'tailwind:tag' with { variant: 'primary', removable: true } %}
  {% block content %}{{ 'Actualités'|t }}{% endblock %}
{% endembed %}
```
