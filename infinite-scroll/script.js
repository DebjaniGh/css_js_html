/* ============================================================
   MENTAL MODEL — Infinite scroll

   The whole feature is one sentence:
     "When a marker element at the bottom of the list becomes
      visible, fetch the next page and append it."

   Think in three layers, in this order:

   1) STATE  — what do I need to know to decide whether to fetch?
        page      -> how far I've got (last page successfully rendered)
        isLoading -> a request is already in flight (don't double-fetch)
        hasError  -> last attempt failed (stop until user retries)
        hasMore   -> server said there is nothing left (stop forever)
      These four booleans/counters ARE the feature. Every bug in
      infinite scroll is a state bug, not a scrolling bug.

   2) TRIGGER — who decides "now"?
        IntersectionObserver watching a zero-height .sentinel <div>
        placed after the list. No scroll listener, no getBoundingClientRect,
        no throttling — the browser does the geometry off the main thread.

   3) EFFECT  — what happens on a trigger?
        loadMore(): guard -> fetch -> render -> commit state.
        Note the ordering: state is committed (page = nextPage) only
        AFTER a successful render. If the fetch throws, `page` is
        untouched, so a retry re-requests the SAME page. That's the
        whole reason we use a local `nextPage` instead of `page++`.

   Guard clause is the heart of it:
     if (isLoading || hasError || !hasMore) return;
   Read it as: "busy, broken, or done -> do nothing."
   The observer will fire many more times than you expect
   (resize, layout shift, appended content). The guard makes those
   extra firings harmless, so the callback can stay dumb.
   ============================================================ */

// ---------- 1) STATE ----------
let page = 0; // last successfully rendered page (0 = nothing loaded yet)
let isLoading = false; // true while a request is in flight -> blocks re-entry
let hasError = false; // true after a failure -> blocks until user hits Retry
let hasMore = true; // false once the server says the list is exhausted

const allProducts = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
}));

// ---------- DOM handles: query once, reuse forever ----------
// sentinel = an empty element rendered *after* the list. It is the
// tripwire: it can only become visible if the user has scrolled past
// everything currently rendered.
const sentinel = document.querySelector(".sentinel");
const loadinElement = document.querySelector(".loading");
const errMsg = document.querySelector(".error-msg");
const prodList = document.querySelector(".product-list");
const retryBtn = document.querySelector(".retry");

/* Keep state and UI in one function so they can never disagree.
   If you set `isLoading = true` in one place and toggle the spinner in
   another, sooner or later you'll update one and forget the other. */
function showLoading(state) {
  isLoading = state;
  loadinElement.hidden = !state; // `hidden` = no CSS needed, and it's a11y-correct
}

function showError(state) {
  hasError = state;
  errMsg.hidden = !state;
}

/* Fake network call. */
function fetchProducts(page, limit = 10) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1-based pages -> 0-based array offset
      const startIndex = (page - 1) * limit;
      const products = allProducts.slice(startIndex, startIndex + limit);

      resolve({
        products,
        hasMore: startIndex + limit < allProducts.length,
        ok: true,
      });
    }, 1000);
  });
}

/* APPEND, never re-render. Infinite scroll is additive by definition —
   rebuilding the whole list each page would be O(n^2) and would also
   destroy scroll position.

   DocumentFragment = an off-screen container. We build all 10 <li>s
   inside it and touch the live DOM exactly once, so the browser does
   one layout/paint instead of ten. */
function renderItems(items) {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const newItem = document.createElement("li");
    newItem.textContent = item.name; // textContent, not innerHTML -> no XSS
    newItem.classList.add("product");
    fragment.appendChild(newItem);
  });

  prodList.append(fragment); // single DOM write
}

/* ---------- 3) EFFECT ----------
   The only function that mutates page/hasMore. Everything else just
   asks it to run. */
async function loadMore() {
  // GUARD: busy, broken, or done -> do nothing
  if (isLoading || hasError || !hasMore) return;

  // Local, not `page++`. `page` stays as "last page we actually rendered"
  // until we know the request succeeded, so a failure leaves state clean
  // and the retry asks for the same page again.
  const nextPage = page + 1;
  showLoading(true); // sets isLoading = true -> closes the door behind us

  try {
    const data = await fetchProducts(nextPage);

    // A resolved promise is not a successful response — check the payload.
    // (With real fetch() this is `if (!res.ok)`: fetch only rejects on
    // network failure, a 500 still resolves.)
    if (!data.ok) {
      throw new Error("request failed");
    }

    // COMMIT ORDER: paint first, then advance state. If renderItems threw,
    // we'd land in catch with `page` unchanged and could safely retry.
    renderItems(data.products);
    page = nextPage;
    hasMore = data.hasMore; // server tells us when to stop
  } catch {
    showError(true); // freezes the loop; only Retry can unfreeze it
  } finally {
    // Runs on success AND failure.
    showLoading(false);
  }
}

/* ---------- 2) TRIGGER ----------
   Watch the sentinel; when it crosses into the viewport, ask for the
   next page.

   Why IntersectionObserver over a scroll listener:
     - fires only on actual visibility changes, not on every scroll tick
     - geometry is computed by the browser, off the main thread
     - no manual throttle/debounce, no scrollTop + offsetHeight math

   The callback is deliberately naive — it fires on every crossing and
   makes no attempt to know whether a fetch is already running. That
   knowledge lives in loadMore()'s guard, in one place.

   Tuning knob: `{ rootMargin: "200px" }` would trigger 200px BEFORE the
   sentinel is visible, so the next page is already loading by the time
   the user reaches the bottom. */
const observer = new IntersectionObserver((entries) => {
  const entry = entries[0]; // only one observed target, so index 0 is it
  if (entry.isIntersecting) {
    loadMore();
  }
});

observer.unobserve(sentinel);
observer.observe(sentinel);

retryBtn.addEventListener("click", () => {
  showError(false);
  loadMore();
});
