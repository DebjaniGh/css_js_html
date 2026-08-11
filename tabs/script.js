/*
click tab
   ↓
find DOM element
   ↓
add/remove .active
   ↓
find corresponding content
   ↓
show/hide DOM */
const tabList = document.querySelector(".tablist");
const tabsDiv = document.querySelector(".tabs");
const allTabs = tabList.querySelectorAll(".tab");

tabList.addEventListener("click", (event) => {
  // find out which tab was clicked
  const tabClicked = event.target.closest(".tab");
  if (!tabClicked) return;

  activate(tabClicked);
});

tabList.addEventListener("keydown", (event) => {
  const currTab = event.target.closest(".tab");
  if (!currTab) return;

  const numTabs = allTabs.length;

  if (event.key === "ArrowRight") {
    // i have handled this event; you don't need to handle it
    event.preventDefault();

    const currTabIndex = Array.from(allTabs).indexOf(currTab);
    const nextTab = allTabs[(currTabIndex + 1) % numTabs];
    nextTab.focus();
    activate(nextTab);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    const currTabIndex = Array.from(allTabs).indexOf(currTab);
    const prevTab = allTabs[(currTabIndex - 1 + numTabs) % numTabs];
    prevTab.focus();
    activate(prevTab);
  } else if (event.key === "Home") {
    event.preventDefault();
    allTabs[0].focus();
    activate(allTabs[0]);
  } else if (event.key === "End") {
    event.preventDefault();
    allTabs[numTabs - 1].focus();
    activate(allTabs[numTabs - 1]);
  }
});

function deactivateTab() {
  // get currently active tab and its content
  const currActiveTab = tabsDiv.querySelector(".tab.active");
  const currActiveContent = tabsDiv.querySelector(".tab-content.active");

  // deactivate the currently active tab
  currActiveTab?.classList.remove("active");
  currActiveTab?.setAttribute("aria-selected", "false");
  currActiveContent?.classList.remove("active");
}

function activate(tabClicked) {
  // get the tab clicked by the user
  const tabId = tabClicked.dataset.tab;
  // get its corresponding content
  const content = tabsDiv.querySelector(`[data-tab-content="${tabId}"]`);

  deactivateTab();

  // activate the clicked tab
  tabClicked.classList.add("active");
  tabClicked.setAttribute("aria-selected", "true");
  content?.classList.add("active");
}
