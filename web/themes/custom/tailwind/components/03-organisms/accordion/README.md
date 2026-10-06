# Accordion

Deliberately JS-free: each entry is a native `<details>/<summary>`, which
gives keyboard toggling (`Enter`/`Space`), screen-reader state announcement,
and even in-page find (`Ctrl+F`) matching inside collapsed panels for free —
none of which a hand-rolled JS accordion gets by default. Maps onto the
`accordion` paragraph type, whose template loops over the paragraph's item
field and renders each through `tailwind:accordion-item`.

Known caveat: Safari draws its own disclosure triangle marker in addition to
our chevron icon unless suppressed with a `::-webkit-details-marker` rule,
which would require an arbitrary Tailwind selector — out of scope per the "no
arbitrary values" constraint. Track this in the CSS reset later if it proves
to matter for the target browser list.

## Slots

`items` — concatenated `tailwind:accordion-item` markup.

## Usage

```twig
{% embed 'tailwind:accordion' %}
  {% block items %}
    {% for item in paragraph.field_items %}
      {% embed 'tailwind:accordion-item' %}
        {% block title %}{{ item.entity.field_title.value }}{% endblock %}
        {% block content %}{{ item.entity.field_body.value|raw }}{% endblock %}
      {% endembed %}
    {% endfor %}
  {% endblock %}
{% endembed %}
```
