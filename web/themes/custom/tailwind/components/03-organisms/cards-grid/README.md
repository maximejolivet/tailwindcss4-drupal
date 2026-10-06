# Cards grid

Grid wrapper only — it does not know how to render a card, it just arranges
pre-rendered `tailwind:card` markup. This is the component the `cards_grid`
paragraph type maps onto: the paragraph template loops over its referenced
`card` child paragraphs, renders each through `paragraph--card.html.twig`
(which embeds `tailwind:card`), and passes the concatenated result as the
`items` slot here.

## Props

| Prop    | Type      | Default | Notes                          |
| ------- | --------- | ------- | -------------------------------- |
| columns | `2\|3\|4` | `3`     | Column count at the `lg` breakpoint; always 1 column below `sm`. |

## Slots

| Slot  | Required | Notes |
| ----- | -------- | ----- |
| items | yes      | Concatenated `tailwind:card` markup. |

## Usage

```twig
{% embed 'tailwind:cards-grid' with { columns: paragraph.field_variant.value|default(3) } %}
  {% block items %}
    {% for card in cards %}{{ card }}{% endfor %}
  {% endblock %}
{% endembed %}
```
