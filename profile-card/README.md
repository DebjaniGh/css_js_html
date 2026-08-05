# Profile Card — Revision Notes

A classic "build a profile card" frontend interview warm-up. Pure HTML + CSS, no JS.
Files: [index.html](index.html), [styles.css](styles.css).

```
+----------------------------------+
|            ( Avatar )            |
|             Jane Doe             |
|    Senior Frontend Engineer      |
|   Angular • RxJS • TypeScript    |
|     [ Follow ]  [ Message ]      |
+----------------------------------+
```

---

## 1. What the interviewer is actually testing

| They ask for | They're checking |
|---|---|
| "Center this card" | Do you reach for `margin: auto` / flex, or hacks? |
| "Make it responsive" | `max-width` + `width: 100%` instinct |
| "Round the avatar" | `border-radius: 50%` **+ `object-fit: cover`** |
| "Add hover states" | Do you animate with `transition`, and only on cheap properties? |
| "Is it accessible?" | Semantic tags, alt text, focus states, contrast |

Talk out loud about these — the markup is trivial, the reasoning is the answer.

---

## 2. Layout core

```css
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;   /* cross axis = horizontal here */
  text-align: center;
  gap: 16px;
  max-width: 300px;
  width: 100%;           /* shrink below 300px on small screens */
  margin: 24px auto;     /* auto L/R = horizontal centering */
  box-sizing: border-box;
}
```

**Points worth saying out loud:**

- **`max-width` + `width: 100%` is the responsive idiom.** A fixed `width: 300px` would overflow a 280px viewport. This pair means "300px cap, fluid below that" — often removes the need for a media query entirely.
- **`align-items` vs `text-align`.** Flex properties position the *boxes*; `text-align` positions the *inline text inside* them. Both are needed: `align-items: center` centers the avatar box, `text-align: center` centers a wrapped two-line job title.
- **In `flex-direction: column`**, main axis = vertical, so `justify-content` controls vertical spacing and `align-items` controls horizontal. Easy trap question — the axes flip.
- **`gap` over margins.** No collapsing margins, no last-child `margin-bottom` to strip off, spacing lives in one place on the parent.
- **`height: auto`** is the default — content determines height. Never hardcode a card height; text length varies and you get overflow.
- **Watch the UA margins on `<h2>`.** Swapping `<div class="name">` for `<h2>` also inherits the browser's default `margin-block` (~0.83em). Inside `.user-info` (a plain block container) that top margin **collapses through** the parent and pushes the whole block down, on top of the card's `gap: 16px`. Reset it — `.name { margin: 0; }` — and let `gap` own all spacing. Good story to tell: semantic upgrade, unexpected layout side-effect, margin collapsing explains it.
- **`box-sizing: border-box`** makes `max-width: 300px` include padding and border. Real projects apply it globally:
  ```css
  *, *::before, *::after { box-sizing: border-box; }
  ```

---

## 3. Avatar

```css
.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;   /* the important one */
}
```

- Forcing a non-square image into a square box **stretches** it. `object-fit: cover` crops to fill instead, preserving aspect ratio. `contain` would letterbox; `object-position` shifts the crop focus (e.g. `object-position: top` to keep faces in frame).
- `border-radius: 50%` on a square = circle. On a non-square box it's an ellipse — another reason the fixed square + `cover` combo matters.
- Add `width`/`height` **attributes** in HTML too, so the browser reserves space and avoids layout shift (CLS).

---

## 4. Buttons & transitions

```css
button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
```

- **`cursor: pointer`** — buttons don't get it by default, unlike links.
- **Transition only cheap properties.** `background-color`, `opacity`, `transform` are composited/painted cheaply. Transitioning `width`, `height`, `top`, `margin` triggers **layout (reflow)** every frame and janks. Classic follow-up: *"why animate `transform: translateX()` instead of `left`?"* → `left` triggers layout, `transform` runs on the compositor, often off the main thread.
- **`transition` goes on the base rule, not `:hover`.** On `:hover` only, it animates in but snaps back out.
- `box-shadow` transitions are moderately expensive (repaint). Cheaper trick: keep a transparent shadow on a pseudo-element and animate its `opacity`.

---

## 5. Accessibility gaps in this version (great "what would you improve?" answer)

✅ **Done:** the name is now an `<h2>` — screen-reader users can reach it via heading navigation.

Still open. Target markup:

```html
<article class="profile-card">
  <img class="avatar" src="./avatar_img.jpg"
       alt="Jane Doe" width="110" height="110" />
  <h2 class="name">Jane Doe</h2>
  <p class="job-role">Senior Frontend Engineer at Microsoft India</p>
  <ul class="skills"> … </ul>
  <div class="actions">
    <button type="button">Follow</button>
    <button type="button">Message</button>
  </div>
</article>
```

- **Semantic container** — `<article>` for a self-contained unit instead of a bare `<div class="profile-card">`. Div soup conveys no structure.
- **`alt` text** — descriptive for meaningful images; `alt=""` for purely decorative ones so screen readers skip them. Never omit the attribute.
- **`type="button"`** — inside a `<form>`, a button defaults to `type="submit"` and will submit it.
- **Visible focus** — never `outline: none` without a replacement. Use `:focus-visible` so keyboard users get a ring but mouse users don't:
  ```css
  button:focus-visible { outline: 2px solid #1a5cbf; outline-offset: 2px; }
  ```
- **Hover ≠ interaction.** Hover states don't exist on touch; every hover affordance needs a focus equivalent.
- **`prefers-reduced-motion`** — disable transitions for users who ask for it:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0.01ms !important; animation: none !important; }
  }
  ```

### Contrast — ✅ fixed

White text on the current button colours:

| Button | Colour | Ratio vs white | AA (4.5:1) |
|---|---|---|---|
| `.follow-btn` | `#1a6fd4` | ~4.9:1 | ✅ |
| `.follow-btn:hover` | `#1558a8` | ~6.6:1 | ✅ |
| `.message-btn` | `#5f5757` | ~7.0:1 | ✅ |
| `.message-btn:hover` | `#4a4444` | ~9.4:1 | ✅ |

The earlier attempt (`#539be8` / `#857c7c`) was a real improvement over the first pass but still landed at ~2.9:1 and ~4.0:1 — blue especially can't carry white text until it's fairly dark, because the green channel dominates the luminance formula (`0.2126R + 0.7152G + 0.0722B`). That's why a "medium" blue looks darker than a medium grey but measures lighter than you'd guess.

**Interview-relevant point:** each hover state must move contrast in the *right direction*. An earlier revision had both hovers lighter than their base, so `.message-btn` dropped from 4.0:1 to 2.3:1 the moment you pointed at it. Convention: hover **darkens** a filled button (or lightens a dark one) — moving toward the text colour is backwards. Both hovers here are now darker than their base, so contrast only improves on interaction.

Rule of thumb worth quoting: AA needs **4.5:1** for normal text, **3:1** for large text (≥18.66px bold or ≥24px) and for UI component boundaries. AAA is 7:1.

---

## 6. Likely follow-up questions

**"Center a div horizontally and vertically."** Three answers, know all three:
```css
/* flex */    .parent { display: flex; justify-content: center; align-items: center; }
/* grid */    .parent { display: grid; place-items: center; }
/* absolute */.child  { position: absolute; inset: 0; margin: auto; }
```

**"Why `rem` and not `px` for font sizes?"** `rem` scales with the root font size, so it respects the user's browser font-size setting; `px` ignores it. Use `rem` for type and spacing, `px` for hairline borders.

**"Make the cards a responsive grid."** No media query needed:
```css
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```
`auto-fit` collapses empty tracks; `auto-fill` keeps them. `minmax(280px, 1fr)` = at least 280px, share leftover space equally.

**"Add dark mode."** CSS custom properties + a media query:
```css
:root { --card-bg: #ececec; --card-fg: #1a1a1a; }
@media (prefers-color-scheme: dark) {
  :root { --card-bg: #1f1f1f; --card-fg: #f0f0f0; }
}
.profile-card { background: var(--card-bg); color: var(--card-fg); }
```
Custom properties are inherited and runtime-swappable — that's why one variable flip re-themes everything.

**"How is specificity resolved?"** inline (1000) > id (100) > class/attribute/pseudo-class (10) > element/pseudo-element (1). Ties break by source order. `!important` overrides all — a smell outside utility overrides.

**"Explain the box model."** content → padding → border → margin. `content-box` (default) sizes only the content; `border-box` includes padding + border. Margins on adjacent block elements **collapse**; flex/grid items never collapse margins.

---

## 7. Quick self-check before you say "done"

- [ ] Shrink to 320px — does it still fit?
- [ ] Tab through — is focus visible on both buttons?
- [ ] Zoom to 200% — does text reflow or clip?
- [ ] Replace the avatar with a wide image — does it stretch?
- [ ] Replace the name with a very long one — does it overflow?
- [ ] Run the button colours through a contrast checker — base **and** hover state
- [ ] Does hover move contrast in the right direction (darker for filled buttons)?
