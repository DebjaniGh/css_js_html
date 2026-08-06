# Modal Dialog — Revision Notes

A confirmation modal ("Delete this project?") built with plain HTML, CSS and JS.
Files: [index.html](index.html), [styles.css](styles.css), [script.js](script.js).

---

## 1. The mental model

A modal is three things stacked:

```
body.modal-open          -> page behind is frozen (no scroll)
  .modal-overlay.show    -> fixed, full-viewport, semi-transparent backdrop
    .modal               -> the actual dialog box, centered
```

Everything else (open/close, escape key, backdrop click) is just toggling two
classes: `show` on the overlay and `modal-open` on the body.

---

## 2. CSS points worth explaining in an interview

### Showing / hiding
```css
.modal-overlay      { display: none; }
.modal-overlay.show { display: flex; ... }
```
`display: none` removes it from the layout **and** from the accessibility tree —
it is not tabbable, not read by screen readers. That is exactly what you want for
a closed modal. (Trade-off: you cannot animate `display`, so a fade-in needs
`opacity` + `visibility` instead.)

### Full-viewport backdrop
```css
position: fixed; top: 0; left: 0; width: 100%; height: 100%;
```
`fixed` positions relative to the **viewport**, not the nearest positioned
ancestor, so the overlay covers the screen even though it lives inside
`.container`, and it stays put if anything behind it scrolls.

> Caveat to know: a `transform`, `filter`, `perspective`, `backdrop-filter`, `will-change`
> or `contain: paint` on an ancestor creates a *containing block* for fixed
> elements and breaks this. That's the classic "why is my `position: fixed`
> modal clipped?" bug — the usual fix is to portal the modal to `document.body`
> (which is what React portals are for).

### Centering
```css
display: flex; justify-content: center; align-items: center;
```
With the default `flex-direction: row`, `justify-content` is the horizontal axis
and `align-items` the vertical one — so a single child lands dead center. No need
to touch `flex-direction` when there is only one child (see the comment in the CSS).

Alternatives to mention: `display: grid; place-items: center;`, or the old
`position:absolute; top:50%; left:50%; transform: translate(-50%,-50%)`.

### Stacking
`z-index: 1000` on the overlay. `z-index` only works on positioned elements
(anything but `position: static`), which `fixed` satisfies. Real-world caveat:
z-index is only compared *within the same stacking context*, so a huge number
does not guarantee you win against a sibling subtree.

### Responsive box
```css
.modal { max-width: 400px; width: 90%; }
```
`width: 90%` is 90% of the **parent** (the overlay, which is full-viewport here,
so effectively 90vw); `max-width` caps it on large screens. This pairing is the
standard "fluid up to a limit" idiom.

### Scroll lock
```css
body.modal-open { overflow: hidden; }
```
Stops the background scrolling while the dialog is up. Known rough edges:
- On iOS Safari `overflow: hidden` on `body` is not always enough (the classic
  fix is `position: fixed` on body plus restoring `scrollTop` on close).
- Hiding the scrollbar on desktop causes a **layout shift**; fix with
  `scrollbar-gutter: stable` or padding the body by the scrollbar width.

---

## 3. JS points worth explaining

### Backdrop click — `event.target` vs `event.currentTarget`
```js
modalOverlay.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeModal();
});
```
- `event.target` — the element actually clicked (deepest node).
- `event.currentTarget` — the element whose listener is running (the overlay).

Because clicks **bubble**, a click on the modal box also fires the overlay's
listener. They are equal only when the overlay itself was clicked, so this one
check closes on backdrop clicks and ignores clicks inside the dialog — no
`stopPropagation()` needed. (Interviewers love this question. The alternative,
`if (!modal.contains(event.target))`, also works.)

### Escape key
```js
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOverlay.classList.contains("show")) closeModal();
});
```
Listener is on `document` because the modal may not hold focus. The `show` guard
keeps it a no-op when the modal is closed. Use `event.key === "Escape"`, not the
deprecated `keyCode === 27`.

### `defer` on the script
```html
<script src="./script.js" defer></script>
```
`defer` downloads in parallel and executes after HTML parsing, so
`document.querySelector` finds the elements — no `DOMContentLoaded` wrapper
needed. `async` would *not* be safe here (it runs as soon as it downloads).

### Why toggle classes instead of setting inline styles?
State lives in the DOM as a class; all presentation stays in CSS. Easy to
animate, easy to query (`classList.contains`), and one source of truth.

---

## 4. Accessibility — what's missing (be ready to name these)

This version is deliberately minimal. A production dialog also needs:

| Gap | Fix |
| --- | --- |
| Not announced as a dialog | `role="dialog" aria-modal="true"` on `.modal` |
| No accessible name | `aria-labelledby` → the `<h2>` id, `aria-describedby` → the `<p>` id |
| Focus stays behind the modal | On open, focus the first control (or the dialog); on close, **return focus to the trigger button** |
| Tab escapes the modal | Focus trap: wrap Tab/Shift+Tab around the first/last focusable element |
| Background still reachable by AT | `inert` on the rest of the page (or `aria-hidden="true"`) |
| Destructive action colour | Delete is blue, Cancel is grey here — semantically Delete should be the danger colour and Cancel the neutral one |

**The native alternative:** `<dialog>` + `dialog.showModal()` gives you the
top-layer, `::backdrop`, Escape-to-close, focus trapping and inertness for free.
Saying "I'd reach for `<dialog>` in production, but here's the manual version"
is a strong answer.

---

## 5. Likely follow-up questions

- *Close on backdrop click without `event.target`?* → `!modal.contains(e.target)`, or a
  separate backdrop element behind the dialog.
- *Animate it in?* → swap `display` for `opacity` + `visibility` + `transition`,
  or keep `display` and animate with `@starting-style` / the Web Animations API.
- *Multiple modals?* → maintain a stack; Escape closes only the topmost.
- *Modal clipped or trapped inside a `transform`ed parent?* → portal it to `body`.
- *Why does the page jump when the modal opens?* → scrollbar disappearing; see
  `scrollbar-gutter: stable`.
- *Memory leaks?* → the `keydown` listener here is global and permanent; in a
  component you'd add it on open and remove it on close (or in a cleanup function).

---

## 6. One-line summary

Overlay is `position: fixed` + flex-centered and toggled by a `.show` class;
backdrop clicks are detected with `event.target === event.currentTarget`;
Escape is handled on `document`; background scroll is locked via a body class.
