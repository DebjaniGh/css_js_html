const menuBtn = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");

menuBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("show");
});
