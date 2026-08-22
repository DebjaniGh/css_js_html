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

  const visiblePages = getVisiblePages();

  // create a btn for every page and append to .page-numbers
  visiblePages.forEach((page) => {
    if (page === "...") {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.classList.add("ellipsis");
      pageNumbers.append(ellipsis);
    } else {
      const newPageBtn = document.createElement("button");
      newPageBtn.textContent = page;
      newPageBtn.dataset.page = page;
      newPageBtn.classList.add("page-btn");
      pageNumbers.append(newPageBtn);
    }
  });
}

// highlight the button matching currentPage, clear the rest
function updateActivePageBtn() {
  const pageBtns = pageNumbers.querySelectorAll(".page-btn");
  pageBtns.forEach((pageBtn) => {
    const page = Number(pageBtn.dataset.page);
    pageBtn.classList.toggle("active", page === currentPage);
  });
}

// full render: page buttons + current page contents
function renderPaginatedList() {
  renderPageNumbers();
  renderCurrentPage();
}

// initial paint
renderPaginatedList();

function goToNext() {
  // guard in case the button is clicked while already on the last page
  if (currentPage === getTotalPages()) {
    return;
  }
  currentPage++;
  renderPaginatedList();
}

function goToPrev() {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  renderPaginatedList();
}

function onPageBtnClick(event) {
  const pageBtnClicked = event.target.closest(".page-btn");
  if (!pageBtnClicked) return;

  const pageNumClicked = Number(pageBtnClicked.dataset.page);
  currentPage = pageNumClicked;
  renderPaginatedList();
}

// delegated click handling so buttons can be re-created freely
pageNumbers.addEventListener("click", (event) => onPageBtnClick(event));

nextBtn.addEventListener("click", goToNext);

prevBtn.addEventListener("click", goToPrev);

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
    return;
  }
  currentPage = Math.min(currentPage, totalPages);
}

// page size changed: recompute the page count and re-render everything
pageSizeSelect.addEventListener("change", () => {
  itemsPerPage = Number(pageSizeSelect.value);
  normalizeCurrPage();
  renderPaginatedList();
});

function getVisiblePages() {
  const visiblePages = [];
  const totalPages = getTotalPages();
  const startPage = Math.max(1, currentPage - 2);
  const lastPage = Math.min(currentPage + 2, totalPages);
  if (totalPages === 0) return [];
  visiblePages.push(1);

  if (startPage > 2) {
    visiblePages.push("...");
  }

  for (let i = startPage; i <= lastPage; i++) {
    if (i === 1 || i === totalPages) continue;
    visiblePages.push(i);
  }

  if (lastPage < totalPages - 1) {
    visiblePages.push("...");
  }

  if (totalPages > 1) {
    visiblePages.push(totalPages);
  }
  return visiblePages;
}
