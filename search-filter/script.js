const users = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Debjani Ghosh",
  "David Miller",
  "Ganesh Pillai",
  "Kaddy Pearson",
];

const searchInput = document.querySelector(".search-input");
const usrList = document.querySelector(".user-list");
const emptyList = document.querySelector(".empty-list");
let timer;

// show all the users on page load
renderUsers(users);

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value;
  // clear the previous timer so that only the latest input by the user is considered
  clearTimeout(timer);

  timer = setTimeout(() => {
    const matchingUsers = filterUsers(searchTerm);
    renderUsers(matchingUsers);
  }, 300);
});

function filterUsers(searchTerm) {
  const usrToBeSearched = searchTerm.toLowerCase();
  return users.filter((user) => user.toLowerCase().includes(usrToBeSearched));
}

function renderUsers(usersToRender) {
  // clear the existing user list
  usrList.replaceChildren();

  // if no matching user found, show appropriate msg
  if (usersToRender.length === 0) {
    emptyList.classList.add("show");
    usrList.classList.add("no-border");
  } else {
    emptyList.classList.remove("show");
    usrList.classList.remove("no-border");
  }

  // render the matched users
  usersToRender.forEach((user) => {
    const newListItem = document.createElement("li");
    newListItem.textContent = user;
    newListItem.classList.add("user");
    usrList.append(newListItem);
  });
}
