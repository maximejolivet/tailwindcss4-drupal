# Button

Renders a `<button>`, or an `<a>` when `url` is set — same classes either way, so
switching a CTA between "does something on this page" and "goes somewhere" never
touches CSS.

## Props

| Prop     | Type              | Default   | Notes                                    |
| -------- | ----------------- | --------- | ----------------------------------------- |
| variant  | `primary\|secondary\|ghost` | `primary` | Visual style.               |
| size     | `sm\|md\|lg`       | `md`      |                                            |
| url      | `string\|null`     | `null`    | Renders `<a href="url">` instead of `<button>`. |
| type     | `button\|submit\|reset` | `button` | Ignored when `url` is set.           |
| disabled | `boolean`          | `false`   | On `<a>`, adds `aria-disabled` + strips focus instead of a real disabled state (links can't be disabled natively). |

## Slots

| Slot    | Required | Notes                                        |
| ------- | -------- | --------------------------------------------- |
| content | yes      | Label text; can include an inlined `tailwind:icon`. |

## Usage

```twig
{# As a link #}
{% embed 'tailwind:button' with { variant: 'primary', size: 'lg', url: '/contact' } %}
  {% block content %}{{ 'Contactez-nous'|t }}{% endblock %}
{% endembed %}

{# As a submit button, e.g. inside a form template override #}
{% embed 'tailwind:button' with { variant: 'secondary', type: 'submit' } %}
  {% block content %}{{ 'Envoyer'|t }}{% endblock %}
{% endembed %}
```
