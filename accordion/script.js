const accordion = document.querySelector(".accordion");

// Initialize all accordions as closed
const allContents = accordion.querySelectorAll(".accordion-content");
allContents.forEach((content) => {
  content.style.height = "0px";
});

accordion.addEventListener("click", (event) => {
  // 1. Ignore clicks that are NOT on a header
  const header = event.target.closest(".accordion-header");

  // 2. Find the clicked accordion item
  const item = header.closest(".accordion-item");

  // 3. Find its content
  /* we firdt find the accordion-otem and then the content, and not use nextElementSibling
  to access the content because in future, the accordion-item might be :
  <accordion-item>
    <div className="accordion-header"></div>
    <div className="something-else"></div>
    <div className="accordion-content"></div>
  </accordion-item> 
  so nextElementSibling will give us somethin-else not the content */
  const content = item.querySelector(".accordion-content");

  // 4. Remember whether it was open
  const wasOpen = content.style.height !== "0px";

  // 5. Close every accordion
  allContents.forEach((content) => {
    content.style.height = "0px";
    const myItem = content.closest(".accordion-item");
    const myHeader = myItem.querySelector(".accordion-header");
    myHeader.classList.remove("open");
  });

  // 6. If it wasn't open, open it
  if (!wasOpen) {
    header.classList.add("open");
    content.style.height = `${content.scrollHeight}px`;
  }
});
