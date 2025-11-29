# Odin Dropdown

An attribute-driven dropdown behavioral utility that automates dropdown content positioning, opening, and closing.

# Installation

```bash
npm install @simeonrediger/dropdown
```

# Usage

Add the `data-dropdown-content` and `id` attributes to each dropdown content element.

```html
<div data-dropdown-content id="content-1"></div>
```

Add the `data-dropdown-trigger` to each dropdown trigger element, and add the `aria-controls` attribute with a value equal to the `id` of the dropdown content that the dropdown trigger should open and close. You can have multiple trigger elements targeting the same content element.

```html
<button data-dropdown-trigger aria-controls="content-1"></button>
```

Initialize the dropdown triggers.

```js
import dropdown from '@simeonrediger/dropdown';

dropdown.init({
    root,
    allowMultipleOpen,
    remainOpenOnEscape,
    remainOpenOnExternalClick,
});
```
