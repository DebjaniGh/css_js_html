import {
  fromEvent,
  map,
  switchMap,
  debounceTime,
  of,
  delay,
} from "https://esm.sh/rxjs";

const users = [
  "Alice Johnson",
  "Alok Mehra",
  "Bob Smith",
  "Charlie Brown",
  "Debjani Ghosh",
  "David Miller",
  "Ganesh Pillai",
  "Kaddy Pearson",
];

const srchInput = document.querySelector(".search-input");
const suggestionList = document.querySelector(".suggestions");

const searchInput$ = fromEvent(srchInput, "input");

const results$ = searchInput$.pipe(
  debounceTime(300),
  map((event) => event.target.value),
  switchMap((searchTerm) => searchUsers(searchTerm)),
);

results$.subscribe((data) => {
  clearSuggestions();
  if (data.searchTerm === "") return; // no query
  renderSuggestions(data.users);
});

function searchUsers(searchTerm) {
  let delayTime = Math.random() * 300 + 300;

  if (searchTerm.trim() === "") {
    return of({ searchTerm, users: [] }).pipe(delay(delayTime));
  } else {
    searchTerm = searchTerm.toLowerCase();
    const matchingUsers = users.filter((user) =>
      user.toLowerCase().includes(searchTerm),
    );

    return of({ searchTerm, users: matchingUsers }).pipe(delay(delayTime));
  }
}

function renderSuggestions(suggestions) {
  if (suggestions.length === 0) {
    // query with no mtaches
    const newListItem = document.createElement("li");
    newListItem.textContent = "No users found.";
    newListItem.classList.add("no-suggestion");
    suggestionList.append(newListItem);
    return;
  }

  suggestions.forEach((suggestion) => {
    const newListItem = document.createElement("li");
    newListItem.textContent = suggestion;
    newListItem.classList.add("suggestion");
    newListItem.setAttribute("role", "option");
    suggestionList.append(newListItem);
  });
  srchInput.setAttribute("aria-expanded", "true");
}

// handle click on the search box
suggestionList.addEventListener("click", handleClick);

function handleClick(event) {
  const suggestionClicked = event.target.closest(".suggestion");
  if (!suggestionClicked) return;
  srchInput.value = suggestionClicked.textContent;
  clearSuggestions();
}

let activeIndex = -1;

// handle keyboard navigation
srchInput.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      handleArrowDown(event);
      break;

    case "ArrowUp":
      handleArrowUp(event);
      break;

    case "Enter":
      handleEnter(event);
      break;

    case "Escape":
      clearSuggestions();
      break;
  }
});

function getAllSuggestions() {
  return suggestionList.querySelectorAll(".suggestion");
}

function updateActiveSuggestion(allSuggestions) {
  allSuggestions.forEach((suggestion, index) => {
    suggestion.classList.toggle("active", index === activeIndex);
  });
}

function handleArrowDown(event) {
  event.preventDefault();
  const allSuggestions = getAllSuggestions();
  if (allSuggestions.length === 0) return;

  activeIndex = (activeIndex + 1) % allSuggestions.length;
  updateActiveSuggestion(allSuggestions);
}

function handleArrowUp(event) {
  event.preventDefault();
  const allSuggestions = getAllSuggestions();
  if (allSuggestions.length === 0) return;

  activeIndex =
    (activeIndex - 1 + allSuggestions.length) % allSuggestions.length;
  updateActiveSuggestion(allSuggestions);
}

function handleEnter(event) {
  event.preventDefault();
  const allSuggestions = getAllSuggestions();
  if (activeIndex === -1) return;
  const currActiveSuggestion = allSuggestions[activeIndex];
  srchInput.value = currActiveSuggestion.textContent;
  clearSuggestions();
}

function clearSuggestions() {
  suggestionList.replaceChildren();
  activeIndex = -1;
  srchInput.setAttribute("aria-expanded", "false");
}
