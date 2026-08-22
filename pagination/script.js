// source data being paginated
const users = [
  "Alex Smith",
  "Jamie Fox",
  "Taylor Reed",
  "Morgan Chase",
  "Jordan Lee",
  "Casey Jones",
  "Avery Davis",
  "Sam Wilson",
  "Riley Clark",
  "Dakota Wright",
  "Quinn Miller",
  "Skyler Moore",
  "Pat Taylor",
  "Reese Baker",
  "Rowan Hill",
  "Cameron King",
  "Ainsley Scott",
  "Kendall Green",
  "Logan Adams",
  "Peyton Ross",
  "Finley Ward",
  "Reagan Cooper",
  "Rory Bailey",
  "James Makhija",
  "Rahul Makhija",
  "Yu Lee",
  "Harlon Coben",
  "Stephen King",
  "Louis Feeny",
  "Antonia Hodgson",
  "Lewis Carol",
  "Stephen Covey",
];

// swap in to test the empty state
//const users = [];

// cached DOM references
const userList = document.querySelector(".user-list");
const pageNumbers = document.querySelector(".page-numbers");
const paginationSection = document.querySelector(".pagination");
const prevBtn = paginationSection.querySelector(".prev");
const nextBtn = paginationSection.querySelector(".next");
const pageSizeSelect = document.querySelector("#page-size");

// pagination state
let currentPage = 1; // 1-based index of the page being viewed
let itemsPerPage = 5; // kept in sync with the page-size dropdown
const totalItems = users.length;

// 0 pages when there is no data, so callers can branch on the empty state
function getTotalPages() {
  return Math.ceil(totalItems / itemsPerPage);
}

// determine indexes of users to be shown on current page
function getCurrentPageUsers() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return users.slice(startIndex, startIndex + itemsPerPage);
}

// render users for current page
function renderUsers(users) {
  // clear existing list of users
  userList.replaceChildren();

  // create a new list item for every user and append to userList
  users.forEach((user) => {
    const newListItem = document.createElement("li");
    newListItem.textContent = user;
    newListItem.classList.add("user");
    userList.append(newListItem);
  });
}

// show no data found
function renderEmptyState() {
  userList.replaceChildren();
  const msg = "No data found";
  const newListItem = document.createElement("li");
  newListItem.textContent = msg;
  newListItem.classList.add("user");
  userList.append(newListItem);
}

// render the list body plus the controls that depend on currentPage
function renderCurrentPage() {
  const totalPages = getTotalPages();

  if (totalPages === 0) {
    renderEmptyState();
  } else {
    renderUsers(getCurrentPageUsers());
  }

  updatePrevNextBtns();
  updateActivePageBtn();
}

// rebuild the numbered page buttons (only changes when page size changes)
function renderPageNumbers() {
  // Clear .page-numbers
  pageNumbers.replaceChildren();
  const totalPages = getTotalPages();

  // create a btn for every page and append to .page-numbers
  for (let page = 1; page <= totalPages; page++) {
    const newPageBtn = document.createElement("button");
    newPageBtn.textContent = page;
    newPageBtn.dataset.page = page;
    newPageBtn.classList.add("page-btn");
    pageNumbers.append(newPageBtn);
  }
}

// highlight the button matching currentPage, clear the rest
function updateActivePageBtn() {
  const pageBtns = pageNumbers.querySelectorAll(".page-btn");
  pageBtns.forEach((pageBtn, index) => {
    pageBtn.classList.toggle("active", index === currentPage - 1);
  });
}

// full render: page buttons + current page contents
function renderPaginatedList() {
  renderPageNumbers();
  renderCurrentPage();
}

// initial paint
renderPaginatedList();

// delegated click handling so buttons can be re-created freely
pageNumbers.addEventListener("click", (event) => {
  const pageBtnClicked = event.target.closest(".page-btn");
  if (!pageBtnClicked) return;

  const pageNumClicked = Number(pageBtnClicked.dataset.page);
  currentPage = pageNumClicked;
  renderCurrentPage();
});

nextBtn.addEventListener("click", () => {
  // guard in case the button is clicked while already on the last page
  if (currentPage === getTotalPages()) {
    return;
  }
  currentPage++;
  renderCurrentPage();
});

prevBtn.addEventListener("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  renderCurrentPage();
});

// disable prev/next at the boundaries (and next when there is no data)
function updatePrevNextBtns() {
  const totalPages = getTotalPages();
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = totalPages === 0 || currentPage === totalPages;
}

// after a page-size change the old currentPage may be out of range, so clamp it
function normalizeCurrPage() {
  const totalPages = getTotalPages();
  if (totalPages === 0) {
    currentPage = 1;
  }
  currentPage = Math.min(currentPage, totalPages);
}

// page size changed: recompute the page count and re-render everything
pageSizeSelect.addEventListener("change", () => {
  itemsPerPage = pageSizeSelect.value;
  normalizeCurrPage();
  renderPaginatedList();
});
