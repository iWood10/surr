// ==UserScript==
// @name         Surr – YouTube
// @description  Removes distractions from YouTube (see data/specification/youtube.md)
// @version      0.1.0
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// ==/UserScript==

// Runs unchanged as a Chrome/Brave content script and as a Safari userscript
// (via the "Userscripts" app).

(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // CSS: everything that can be hidden with selectors alone
  // ---------------------------------------------------------------------------

  const HIDE = [
    // --- Sidebar (desktop) ---
    'ytd-guide-entry-renderer:has(> a[href="/"])',
    'ytd-guide-entry-renderer:has(> a[title="Shorts"])',
    'ytd-guide-entry-renderer:has(a[href^="/feed/subscriptions"])',
    'ytd-guide-section-renderer:has(a[href^="/feed/channels"])', // subscribed channels
    'ytd-guide-section-renderer:has(a[href="/gaming"])', // Explore
    'ytd-guide-section-renderer:has(a[href*="youtubekids.com"])', // More from YouTube
    'ytd-mini-guide-entry-renderer:has(> a[href="/"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'ytd-mini-guide-entry-renderer:has(a[href^="/feed/subscriptions"])',

    // --- Notification bell ---
    "ytd-notification-topbar-button-renderer",
    'ytm-mobile-topbar-renderer button[aria-label*="Benachrichtigung" i]',
    'ytm-mobile-topbar-renderer button[aria-label*="notification" i]',

    // --- Home page ---
    'html.surr-home ytd-browse[page-subtype="home"]',
    "html.surr-home ytd-masthead #center",
    "html.surr-home ytm-browse",
    'html.surr-home ytm-mobile-topbar-renderer button[aria-label*="such" i]',
    'html.surr-home ytm-mobile-topbar-renderer button[aria-label*="search" i]',

    // --- Search suggestions ---
    ".ytSearchboxComponentSuggestionsContainer",
    ".sbdd_a",
    ".gstl_50",
    ".searchbox-dropdown",
    "ytm-search-suggestions",
    ".search-suggestion",

    // --- Player ---
    // YouTube also puts some of these classes on the player element itself
    // (e.g. "ytp-fullscreen-grid-peeking" in fullscreen), so the player is excluded.
    ...[
      ".ytp-autonav-toggle",
      ".ytp-autonav-toggle-button-container",
      ".ytm-autonav-toggle-button-container",
      ".ytp-autonav-endscreen-countdown-overlay",
      ".ytp-upnext",
      ".ytp-ce-element",
      ".ytp-endscreen-content",
      ".html5-endscreen",
      ".ytp-cards-button",
      ".ytp-cards-teaser",
      ".iv-branding",
      ".branding-img-container",
      ".ytp-pause-overlay",
      ".ytp-fullscreen-grid",
      ".ytp-fullerscreen-edu-button",
      ".ytp-suggested-action",
    ].map((s) => `${s}:not(.html5-video-player):not(#movie_player):not(video)`),

    // --- Watch page (desktop) ---
    "ytd-watch-flexy #comments",
    "ytd-watch-flexy #sponsor-button",
    "ytd-watch-flexy ytd-merch-shelf-renderer",
    "ytd-watch-flexy #ticket-shelf",
    "ytd-watch-flexy #donation-shelf",
    "ytd-watch-flexy ytd-donation-shelf-renderer",
    "ytd-watch-flexy #related",
    "ytd-watch-flexy #chat-container",
    "ytd-watch-flexy ytd-live-chat-frame",

    // --- Watch page (mobile) ---
    "html.surr-watch ytm-comments-entry-point-header-renderer",
    "html.surr-watch ytm-comment-section-renderer",
    'html.surr-watch ytm-item-section-renderer[section-identifier="related-items"]',
    "html.surr-watch ytm-item-section-renderer:has(ytm-video-with-context-renderer)",
    "html.surr-watch ytm-item-section-renderer:has(ytm-compact-video-renderer)",
    "html.surr-watch ytm-merch-shelf-renderer",

    // --- Search results ---
    "ytd-search ytd-shelf-renderer",
    "ytd-search ytd-horizontal-card-list-renderer",
    "ytm-search ytm-shelf-renderer",
    "ytm-search ytm-horizontal-card-list-renderer",

    // --- Inline playback (mobile; desktop is handled by the hover blocker below) ---
    "ytm-inline-player-controls",

    // --- Channel page ---
    'yt-tab-shape[tab-title="Übersicht"]',
    'yt-tab-shape[tab-title="Home"]',
    'yt-tab-shape[tab-title="Beiträge"]',
    'yt-tab-shape[tab-title="Community"]',
    'yt-tab-shape[tab-title="Posts"]',
    "ytd-browse ytd-merch-shelf-renderer",

    // --- Playlist page: recommendations below the list ---
    'ytd-browse[page-subtype="playlist"] ytd-item-section-renderer:not(:has(ytd-playlist-video-list-renderer))',

    // --- Mobile bottom bar ---
    "ytm-pivot-bar-item-renderer:has(.pivot-w2w)",
    "ytm-pivot-bar-item-renderer:has(.pivot-shorts)",
    "ytm-pivot-bar-item-renderer:has(.pivot-subs)",

    // --- Ads and banners ---
    "#masthead-ad",
    "#player-ads",
    "ytd-ad-slot-renderer",
    "ytd-in-feed-ad-layout-renderer",
    "ytd-display-ad-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-search-pyv-renderer",
    "ytd-companion-slot-renderer",
    "ytd-banner-promo-renderer",
    "ytd-statement-banner-renderer",
    "ytd-mealbar-promo-renderer",
    "ytm-promoted-sparkles-web-renderer",
    "ytm-companion-ad-renderer",
    "ytm-statement-banner-renderer",
    "ytm-mealbar-promo-renderer",
    "ytm-ad-slot-renderer",
  ];

  const CSS = `
${HIDE.join(",\n")} { display: none !important; }

#surr-search {
  position: fixed;
  top: 38vh;
  left: 50%;
  transform: translateX(-50%);
  width: min(600px, calc(100vw - 32px));
  z-index: 1000;
}
#surr-search input {
  box-sizing: border-box;
  width: 100%;
  padding: 14px 22px;
  font: 18px Roboto, Arial, sans-serif;
  color: inherit;
  background: transparent;
  border: 1px solid rgba(128, 128, 128, 0.5);
  border-radius: 999px;
  outline: none;
}
#surr-search input:focus { border-color: #1c62b9; }
html[dark] #surr-search input { color: #f1f1f1; }
`;

  const style = document.createElement("style");
  style.id = "surr-style";
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  // ---------------------------------------------------------------------------
  // Redirects
  // ---------------------------------------------------------------------------

  // Allowed pages under /feed/ – everything else there is blocked
  const ALLOWED_FEEDS = ["you", "history", "playlists", "library", "downloads", "clips", "purchases"];

  // Explore channels (music, live, sports, news, gaming, fashion, learning)
  const EXPLORE_CHANNELS = [
    "UC-9-kyTW8ZkZNDHQJ6FgpwQ",
    "UC4R8DWoMoI7CAwX8_LjQHig",
    "UCEgdi0XIXXZ-qJOFPf4JSKw",
    "UCYfdidRxbB8Qhf0Nx7ioOYw",
    "UCOpNcN46UbXVtpKMrmU4Abg",
    "UCrpQ4p1Ql_hG8rKXIKM1MOQ",
    "UCtFRv9O2AHqOZjjynzrv-xg",
  ];

  const CHANNEL_ROOT = /^\/(@[^/]+|channel\/[^/]+|c\/[^/]+|user\/[^/]+)(\/featured)?\/?$/;

  function redirectTarget(path) {
    const shorts = path.match(/^\/shorts\/([\w-]+)/);
    if (shorts) return `/watch?v=${shorts[1]}`;

    const feed = path.match(/^\/feed\/([^/]+)/);
    if (feed && !ALLOWED_FEEDS.includes(feed[1])) return "/";
    if (/^\/(gaming|podcasts)\/?$/.test(path)) return "/";
    if (EXPLORE_CHANNELS.some((id) => path.startsWith(`/channel/${id}`))) return "/";

    const channel = path.match(CHANNEL_ROOT);
    if (channel) return `/${channel[1]}/videos`;

    return null;
  }

  // Intercept clicks on Shorts links before YouTube opens them in the Shorts player
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest?.('a[href^="/shorts/"], a[href*="youtube.com/shorts/"]');
      if (!link) return;
      const id = new URL(link.href, location.origin).pathname.split("/")[2];
      if (!id) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      location.href = `/watch?v=${id}`;
    },
    true
  );

  // Hide hover events on thumbnails from YouTube, so neither previews nor inline playback start.
  // Pure CSS hover effects keep working.
  const THUMBNAIL_ITEMS = [
    "ytd-thumbnail",
    "ytd-rich-item-renderer",
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
    "ytd-playlist-video-renderer",
    "yt-lockup-view-model",
  ].join(", ");

  for (const type of ["mouseover", "mouseenter", "mousemove", "pointerover", "pointerenter", "pointermove"]) {
    document.addEventListener(
      type,
      (e) => {
        if (e.target.closest?.(THUMBNAIL_ITEMS)) e.stopImmediatePropagation();
      },
      true
    );
  }

  // ---------------------------------------------------------------------------
  // Home page search bar
  // ---------------------------------------------------------------------------

  function ensureHomeSearch() {
    let form = document.getElementById("surr-search");
    if (form || !document.body) return form;

    form = document.createElement("form");
    form.id = "surr-search";
    form.hidden = true;

    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search";
    input.autocomplete = "off";
    input.setAttribute("autocorrect", "off");
    input.spellcheck = false;
    form.appendChild(input);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) location.href = `/results?search_query=${encodeURIComponent(q)}`;
    });

    document.body.appendChild(form);
    return form;
  }

  // ---------------------------------------------------------------------------
  // Things CSS can't do (matching text, clicking)
  // ---------------------------------------------------------------------------

  // Find subscriptions in the sidebar by their visible title, independent of the markup.
  // This removes the first section (Home, Shorts, Subscriptions) and the channel list.
  function hideGuideSubscriptions() {
    const titles = ["Abos", "Abonnements", "Subscriptions"];
    const isSubs = (el) => titles.includes(el.textContent.trim());

    document.querySelectorAll("ytd-guide-section-renderer").forEach((section) => {
      if ([...section.querySelectorAll("#guide-section-title, .title")].some(isSubs)) {
        section.style.setProperty("display", "none", "important");
      }
    });
    document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach((entry) => {
      if ([...entry.querySelectorAll(".title")].some(isSubs)) entry.style.setProperty("display", "none", "important");
    });
  }

  function hideShortsChips() {
    document.querySelectorAll("yt-chip-cloud-chip-renderer, ytm-chip-cloud-chip-renderer").forEach((chip) => {
      if (chip.textContent.trim() === "Shorts") chip.style.setProperty("display", "none", "important");
    });
  }

  function hideMobileChannelTabs() {
    const hidden = ["Übersicht", "Home", "Beiträge", "Community", "Posts"];
    document.querySelectorAll("ytm-browse .scbrr-tabs a, ytm-browse [role='tab']").forEach((tab) => {
      if (hidden.includes(tab.textContent.trim())) tab.style.setProperty("display", "none", "important");
    });
  }

  function disableAutoplay() {
    const on = document.querySelector(
      '.ytp-autonav-toggle-button[aria-checked="true"], .ytm-autonav-toggle-button-container[aria-pressed="true"]'
    );
    if (on) on.click();

    const cancel = document.querySelector(".ytp-autonav-endscreen-upnext-cancel-button");
    if (cancel) cancel.click();
  }

  function stopPreviewVideos() {
    document
      .querySelectorAll("ytd-video-preview video, #video-preview video, #inline-player video, ytm-inline-player video")
      .forEach((v) => {
        v.muted = true;
        if (!v.paused) v.pause();
      });
  }

  // ---------------------------------------------------------------------------
  // Main loop
  // ---------------------------------------------------------------------------

  let lastUrl = "";

  function onUrlChange() {
    const target = redirectTarget(location.pathname);
    if (target) {
      location.replace(target);
      return;
    }

    const isHome = location.pathname === "/";
    document.documentElement.classList.toggle("surr-home", isHome);
    document.documentElement.classList.toggle("surr-watch", location.pathname === "/watch");

    const form = ensureHomeSearch();
    if (form) {
      form.hidden = !isHome;
      if (isHome) form.querySelector("input").focus();
    }
  }

  function tick() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
    if (!document.getElementById("surr-search") && document.body) onUrlChange();

    hideGuideSubscriptions();
    hideShortsChips();
    hideMobileChannelTabs();
    disableAutoplay();
    stopPreviewVideos();
  }

  tick();
  setInterval(tick, 300);
})();
