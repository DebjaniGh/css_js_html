# Search Bar

A search input with a leading icon, built with plain HTML/CSS.

## Files

- [index.html](index.html) — markup
- [styles.css](styles.css) — layout + focus styles
- [index.js](index.js) — currently empty (see "Next steps")

Open `index.html` directly in a browser; there is no build step.

## The core problem

You need an icon sitting _inside_ the input. An `<input>` cannot have child elements, so the icon must be a sibling that is visually overlaid.

```html
<div class="searchbar">
  <!-- position: relative -->
  <span class="search-icon">🔍</span>
  <!-- position: absolute -->
  <input class="search-input" type="text" placeholder="Search..." />
</div>
```

Three details that interviewers probe:

**1. Positioning context.** The wrapper is `position: relative` so the absolutely positioned icon resolves against it rather than the viewport. Dropping the `relative` is the single most common bug here.

**2. Vertical centering.** `top: 50%; transform: translateY(-50%)` centers the icon regardless of its own height. `top: 50%` alone aligns the icon's _top edge_ to the middle; the `translateY(-50%)` pulls it back by half its own height. Percentage transforms resolve against the element's own box, which is exactly why this trick works when you don't know the icon's size.

**3. Keeping text off the icon.** The input has `padding: 12px 36px` so typed text starts clear of the icon. Note this is symmetric — the right side gets 36px it doesn't need. Deliberate asymmetry (`padding: 12px 12px 12px 36px`) would be tighter.

## Box model

`box-sizing: border-box` means the declared `width: 300px` is the _total_ rendered width, padding and border included. Without it the input would render at 300 + 72 + 2 = 374px.

## Focus and accessibility

`:focus-visible` is used rather than `:focus`, so the focus ring appears for keyboard users but not on mouse click. The default outline is replaced, not removed — never `outline: none` without a substitute, or keyboard users lose all indication of position.

### Known gaps

Worth naming out loud in an interview rather than leaving unsaid:

- **No accessible name.** The input has only a `placeholder`. Placeholders are announced inconsistently by screen readers and vanish the moment the user types. It needs a real `<label>` (visually hidden if the design has no room) or an `aria-label`.
- **The icon is announced.** The 🔍 emoji is in the accessibility tree and will be read aloud as "magnifying glass". It is decorative and should carry `aria-hidden="true"`.
- **`type="text"` rather than `type="search"`.** `search` gives mobile keyboards a "Search" action key and, in a form, a native clear button.
- **Contrast.** The `#888` placeholder on white lands around 3.5:1 — below the 4.5:1 WCAG AA threshold for body text.

## Next steps

`index.js` is a placeholder. The natural extensions, roughly in the order interviewers ask for them:

1. Debounced input handling so you don't fire a request per keystroke.
2. A filtered suggestions dropdown.
3. Keyboard navigation of that dropdown — arrow keys, Enter, Escape.
4. The combobox ARIA pattern: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`.
5. Race-condition handling — an earlier request resolving after a later one must not overwrite fresher results.

## Talking points

- Why `position: absolute` over flexbox? Flex would reserve layout space for the icon; absolute takes it out of normal document flow so it genuinely overlays the input.
- Why not `background-image` on the input? Viable and one fewer element, but it can't be styled or made interactive — a clear or submit button has to be a real element.
- Why is the wrapper a `div` and not a `form`? A `form` gives you free Enter-to-submit; the tradeoff is you then own the `submit` handler and `preventDefault`.
