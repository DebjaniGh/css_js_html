const saveBtn = document.querySelector(".save-changes");
const toast = document.querySelector(".toast");

/* use a handler method to deal with save functionality
today you are just showing  a toast with a msg
tomorrow you might want to download a doc on save changes, 
then show the toast msg, all of this can be added to 
the handler method */
saveBtn.addEventListener("click", () => handleSave());

let toastTimer;

function handleSave() {
  showToast("Changes saved successfully!");
}

function showToast(msg) {
  // update the msg
  toast.textContent = msg;

  // show the toast
  toast.classList.add("show");

  // cancel any previously registered timer
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    hideToast();
  }, 3000);
}

function hideToast() {
  toast.classList.remove("show");
}
