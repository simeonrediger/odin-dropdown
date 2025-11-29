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

# Options

## `root`

Default is `document`. Must be an `Element`, `Document`, or `DocumentFragment`. Allows for more specific scoping of dropdown initialization.

## `allowMultipleOpen`

Default is `false`. Setting to `true` will allow multiple dropdowns to be open at once, rather than closing any open dropdown when another is opened. Each opened dropdown must be a unique element to prevent one dropdown trigger from stealing another dropdown trigger's dropdown content.

## `remainOpenOnEscape`

Default is `false`. Setting to `true` will prevent dropdown(s) from being closed when the Escape key is pressed.

## `remainOpenOnExternalClick`

Default is `false`. Setting to `true` will prevent dropdown(s) from being closed when the `mousedown` event targets an element that is not a dropdown content element. This option will always be `true` if `allowMultipleOpen` is `true`.
