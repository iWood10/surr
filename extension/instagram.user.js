// ==UserScript==
// @name         Surr – Instagram
// @description  Friends, search and messages only (see data/specification/instagram.md)
// @version      0.1.0
// @match        https://www.instagram.com/*
// @run-at       document-start
// ==/UserScript==

// Runs unchanged as a Chrome/Brave content script and as a Safari userscript
// (via the "Userscripts" app).
//
// Instagram uses obfuscated class names, so elements are matched by
// links (href), aria-labels and visible text instead.

(() => {
  "use strict";

  const HOME = "/?variant=following";

  // Above this width Instagram shows the desktop sidebar instead of the bottom bar
  const DESKTOP = matchMedia("(min-width: 768px)");

  // ---------------------------------------------------------------------------
  // CSS
  // ---------------------------------------------------------------------------

  const HIDE = [
    'a[href="/reels/"]',
    'a[href*="threads.net"]',
    'a[href*="threads.com"]',

    // Explore grid (mobile): only the search field remains
    'html.surr-explore main a[href*="/p/"]',
    'html.surr-explore main a[href*="/reel/"]',

    // "Similar accounts" button on profiles
    'div[role="button"]:has(svg[aria-label="Ähnliche Konten"])',
    'div[role="button"]:has(svg[aria-label="Vorgeschlagene Konten"])',
    'div[role="button"]:has(svg[aria-label="Similar accounts"])',
    'div[role="button"]:has(svg[aria-label="Suggested accounts"])',
  ];

  const CSS = `
${HIDE.join(",\n")} { display: none !important; }

@media (min-width: 768px) {
  a[href="/explore/"] { display: none !important; }
}
`;

  const style = document.createElement("style");
  style.id = "surr-style";
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  // ---------------------------------------------------------------------------
  // Redirects
  // ---------------------------------------------------------------------------

  // If Instagram redirects /p/ID back to /reel/ID, don't bounce back and forth forever –
  // leave the reel as is on the second attempt.
  function reelTarget(id) {
    const key = `surr-reel-${id}`;
    try {
      if (Date.now() - Number(sessionStorage.getItem(key)) < 15000) return null;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {}
    return `/p/${id}/`;
  }

  function redirectTarget(path, search) {
    // /reel/ID, /reels/ID, /name/reel/ID → /p/ID
    const reel = path.match(/^\/(?:[\w.]+\/)?reels?\/([\w-]+)\/?$/);
    if (reel) return reelTarget(reel[1]);

    if (path === "/" && !search.includes("variant=following")) return HOME;
    if (path === "/reels/" || path === "/reels") return HOME;
    if (/^\/explore\/(people|tags|locations)\b/.test(path)) return HOME;
    if (path === "/explore/" && DESKTOP.matches) return HOME;

    return null;
  }

  // Intercept link clicks before Instagram navigates internally
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest?.("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.origin);
      if (url.origin !== location.origin) return;
      const target = redirectTarget(url.pathname, url.search);
      if (!target) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      location.href = target;
    },
    true
  );

  // ---------------------------------------------------------------------------
  // Hiding by visible text (German and English UI)
  // ---------------------------------------------------------------------------

  const SPONSORED = ["Gesponsert", "Sponsored", "Anzeige"];
  const SUGGESTIONS = [
    "Vorschläge für dich",
    "Vorgeschlagen für dich",
    "Vorgeschlagene Beiträge",
    "Ähnliche Konten",
    "Suggested for you",
    "Suggested posts",
    "Similar accounts",
  ];
  const MORE_POSTS = ["Weitere Beiträge von", "More posts from"];
  const APP_BANNER = ["In der App öffnen", "App öffnen", "App verwenden", "Open app", "Open in app", "Use the app"];
  const FOLLOW = ["Folgen", "Follow"];

  function hide(el) {
    if (!el || el.dataset.surrHidden) return;
    el.dataset.surrHidden = "1";
    el.style.setProperty("display", "none", "important");
  }

  // All elements whose short text content satisfies the test
  function elementsWithText(test) {
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue.trim();
      if (text && text.length < 40 && test(text)) found.push(node.parentElement);
    }
    return found;
  }

  // These areas must never be hidden
  const PROTECTED = 'main, article, header, nav, [role="main"], [role="dialog"], a[href^="/direct/"]';

  // Walk up from the element until an ancestor satisfies the test.
  // Stops (hiding nothing) as soon as an ancestor contains a protected area.
  function closestBlock(el, test, maxDepth = 8) {
    for (let i = 0; el && el !== document.body && i < maxDepth; i++, el = el.parentElement) {
      if (el.matches(PROTECTED) || el.querySelector(PROTECTED)) return null;
      if (test(el)) return el;
    }
    return null;
  }

  // Number of distinct posts linked inside a block
  // (excluding the currently open post and comment links)
  function otherPostCount(el) {
    const current = location.pathname.split("/")[2];
    const ids = new Set();
    el.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach((a) => {
      const m = a.getAttribute("href").match(/\/(?:p|reel)\/([\w-]+)\/?$/);
      if (m && m[1] !== current) ids.add(m[1]);
    });
    return ids.size;
  }

  const followButtonCount = (el) =>
    [...el.querySelectorAll('button, div[role="button"]')].filter((b) => FOLLOW.includes(b.textContent.trim()))
      .length;

  function hideByText() {
    if (!document.body) return;

    // Only hide whole posts in the feed – never on a post or profile page
    const inFeed = location.pathname === "/";

    // Ads in the feed
    if (inFeed) elementsWithText((t) => SPONSORED.includes(t)).forEach((el) => hide(el.closest("article")));

    // Suggestions: the whole post (feed) or the account suggestion box
    elementsWithText((t) => SUGGESTIONS.includes(t)).forEach((el) => {
      const article = el.closest("article");
      if (article) return inFeed && hide(article);
      hide(
        closestBlock(
          el,
          (b) => b.querySelector('a[href="/explore/people/"]') || followButtonCount(b) >= 2
        )
      );
    });

    // "More posts from …" below a post
    elementsWithText((t) => MORE_POSTS.some((p) => t.startsWith(p))).forEach((el) => {
      hide(closestBlock(el, (b) => otherPostCount(b) >= 3));
    });

    // "Open in app" banner (mobile)
    elementsWithText((t) => APP_BANNER.includes(t)).forEach((el) => {
      const fixed = closestBlock(el, (b) => ["fixed", "sticky"].includes(getComputedStyle(b).position), 8);
      hide(fixed || el.closest('a, button, div[role="button"]'));
    });
  }

  function stopExploreVideos() {
    if (!location.pathname.startsWith("/explore")) return;
    document.querySelectorAll("main video").forEach((v) => {
      v.muted = true;
      if (!v.paused) v.pause();
    });
  }

  // ---------------------------------------------------------------------------
  // Main loop
  // ---------------------------------------------------------------------------

  let lastUrl = "";

  function tick() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const target = redirectTarget(location.pathname, location.search);
      if (target) {
        location.replace(target);
        return;
      }
      document.documentElement.classList.toggle("surr-explore", location.pathname === "/explore/");
    }
  }

  let scheduled = false;
  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      hideByText();
      stopExploreVideos();
    }, 200);
  }

  tick();
  setInterval(tick, 300);

  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
})();
