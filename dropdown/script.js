const dropdown = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownMenu = document.querySelector(".dropdown-menu");

/* document gives us a place where we can observe every click; 
dropdown.contains(event.target) tells us whether that click belongs
 to our dropdown. */
document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  const isOpen = isMenuOpen();
  if (event.key === "Escape" && isOpen) {
    closeMenu();
  }
});

// clicking on the dropdown should open/close the menu
dropdownBtn.addEventListener("click", toggleMenu);

dropdownMenu.addEventListener("click", (event) => {
  // get which option was clicked by the user
  const optionClicked = event.target.closest(".dropdown-option");

  // guard against user clicking on padding around the option
  if (!optionClicked) return;

  // replace button content with option value
  dropdownBtn.textContent = optionClicked.textContent;

  // once an option is clicked, always close the menu
  closeMenu();
});

function isMenuOpen() {
  return dropdownMenu.classList.contains("open");
}

function toggleMenu() {
  dropdownMenu.classList.toggle("open");
  const isOpen = isMenuOpen();
  setA11yforDropdownBtn(isOpen);
}

// set accessibility for dropdwon button
function setA11yforDropdownBtn(isOpen) {
  dropdownBtn.setAttribute("aria-expanded", isOpen);
}

function closeMenu() {
  dropdownMenu.classList.remove("open");
  setA11yforDropdownBtn(false);
}
