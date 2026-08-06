const dltProject = document.querySelector(".dlt-project");
const modalOverlay = document.querySelector(".modal-overlay");
const cancelBtn = document.querySelector(".cancel-btn");

dltProject.addEventListener("click", () => openModal());

modalOverlay.addEventListener("click", (event) => {
  /* Close only if the user clicked the backdrop itself.
   If the user clicks inside the modal,
   event.target will be the modal,
   while event.currentTarget will be the overlay. */
  if (event.target === event.currentTarget) {
    closeModal();
  }
});

cancelBtn.addEventListener("click", () => {
  closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOverlay.classList.contains("show")) {
    closeModal();
  }
});

function openModal() {
  document.body.classList.add("modal-open");
  modalOverlay.classList.add("show");
}

function closeModal() {
  document.body.classList.remove("modal-open");
  modalOverlay.classList.remove("show");
}
