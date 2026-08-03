# Responsive Navbar (HTML, CSS & JavaScript)

## Objective

Build a responsive navigation bar that:

- Displays navigation links and action buttons on desktop.
- Displays a hamburger menu on mobile.
- Opens a dropdown menu on clicking the hamburger.
- Uses clean HTML structure and separation of concerns.

---

# Final Layout

Desktop

---

MyBrand Home Docs Pricing Login Signup

---

Mobile

---

MyBrand ☰

---

↓

Click

---

Home

Docs

Pricing

---

Login

Signup

---

---

# Technologies Used

- HTML5
- CSS3
- Flexbox
- Media Queries
- JavaScript (DOM Events)

---

# HTML Structure

<header class="navbar">

    Logo

    Desktop Navigation

        Desktop Links

        Desktop Action Buttons

    Hamburger Button

    Mobile Navigation

</header>

Why two navigation sections?

Instead of trying to transform one HTML structure into two completely different layouts, we maintain:

- Desktop Navigation
- Mobile Navigation

Benefits:

- Cleaner CSS
- Easier maintenance
- Simpler browser layout
- Less nested Flexbox

---

# Browser Rendering Algorithm

Desktop

Browser sees

Navbar

├── Logo

├── Desktop Nav

├── Hamburger

└── Mobile Nav

Desktop rules

Desktop Nav → Visible, Hamburger → Hidden, Mobile Nav → Hidden

---

Mobile

Media query becomes active.

Browser now renders

Logo → Visible

Desktop Nav → Hidden

Hamburger → Visible

Mobile Nav → Hidden

Notice:

JavaScript has not executed yet. CSS alone determines what is visible depending on screen width.

---

# Flexbox Layout

Navbar

display:flex;

Children

Logo

Desktop Nav

Hamburger

Desktop Nav uses

display:flex;
flex:1;

Its children are

Desktop Links

Desktop Actions

Desktop Links

display:flex;
flex:1;
justify-content:center;

Browser Algorithm

1. Measure Logo width.

2. Measure Desktop Actions width.

3. Remaining width goes to Desktop Links because of flex:1.

4. Browser enters Desktop Links.

5. Browser centers Home Docs Pricing inside that available width.

Final Layout

Logo Home Docs Pricing Login Signup

---

# Why flex:1 was applied to Desktop Links

Links should consume remaining width. Buttons should stay at the right.

If we had instead done this:

Desktop Actions → flex:1

Action container becomes very wide. Buttons remain at flex-start. Buttons appear shifted left.

---

# Hover Effects

Links

transition: color 0.3s ease;

Buttons

transition: background-color 0.3s ease;

Reason

Transitions are applied on the normal state.

The browser stores: "If this property changes later, animate it." Hover only changes the property value.

---

# Responsive Design

Media Query

@media(max-width:500px)

Desktop Navigation

display:none;

Hamburger

display:block;

Mobile Navigation

Initially hidden.

Browser displays

Logo

Hamburger

Only.

---

# JavaScript

Why classList.toggle() instead of style.display?

JavaScript should only manage component state. CSS should manage appearance.

JavaScript

↓

Menu is open.

CSS

↓

How should an open menu look?

This creates proper separation of concerns.

---

# Positioning

Navbar

position:relative;

Dropdown

position:absolute;

top:100%;

left:0;

width:100%;

Reason

Without absolute positioning, Dropdown participates in normal document flow. Navbar becomes taller.

With absolute positioning, Dropdown is removed from normal flow. It appears below the navbar.

---

# Important Browser Mental Models

Flexbox

The browser measures available space. Then distributes remaining free space. Then runs Flexbox again inside nested flex containers.

---

Transitions

Browser remembers transition rules first. Later, when a property changes, it animates that property.

---

Hover

:hover is simply another selector. Browser switches from

.button

to

.button:hover

No magic. Only different CSS rules.

---

Media Queries

Media Queries only decide "What should be visible?" They do not open menus. JavaScript handles interaction.

---

Position Absolute

Absolute elements do not occupy layout space. They are positioned relative to the nearest ancestor having position:relative.

---

Q1. Why use Flexbox instead of floats?

- Easier alignment.
- Better responsiveness.
- No float clearing.
- Simple centering.
- Equal-height layouts.

---
