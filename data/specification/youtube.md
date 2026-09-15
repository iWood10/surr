# YouTube – Specification

Goal: remove distractions, keep what's useful. Applies to desktop (Chrome/Brave) and mobile (Safari, m.youtube.com).

## General (everywhere)

- Search: **no suggestions** while typing, **no search history** in the dropdown
- Shorts links (`/shorts/ID`) are rewritten to `/watch?v=ID`
- Opening `/shorts/ID` directly → redirect to `/watch?v=ID`
- Preview playback on hover / while scrolling: off
- Ad and promo banners: hidden (in-video ads → ad blocker/Brave)
- Autoplay: always off

## Header

| Element | |
|---|---|
| YouTube logo | keep |
| Search bar | keep (hidden on the home page) |
| Voice search | keep |
| "Create" button | keep |
| Notifications (bell) | hide |
| Profile picture | keep |

## Left sidebar

| Element | |
|---|---|
| Home | hide |
| Shorts | hide |
| Subscriptions | hide |
| "You" section (history, playlists, watch later, liked videos) | keep |
| List of subscribed channels | hide |
| Explore (trending, music, gaming …) | hide |
| More from YouTube | hide |
| Settings, help, feedback | keep |

## Home page

- Main area completely empty, **only one large search bar in the center** (without suggestions)
- Topic chips, recommended videos, Shorts shelf, other shelves, ads: hidden

## Watch page

| Element | |
|---|---|
| Video player | keep |
| Autoplay toggle | hide (autoplay off) |
| End screen cards | hide |
| Info cards ("i") | hide |
| Suggestions when scrolling in fullscreen | hide |
| "Up next" overlay near the end | hide |
| Channel watermark bottom right | hide |
| "More videos" overlay when paused | hide |
| Video title | keep |
| Channel name + subscribe | keep |
| Like/dislike | keep |
| Share, save, download, clip, "…" | keep |
| Description | keep |
| Chapters | keep |
| Comments | hide |
| "Join", donations, products | hide |
| Topic chips on the right | hide |
| Recommended videos on the right | hide |
| Playlist panel | keep |
| Live chat | hide |

## Search results

| Element | |
|---|---|
| Filter button | keep |
| Topic chips | keep, but without the "Shorts" chip |
| Videos, channels, playlists/mixes | keep |
| Thumbnails, description snippet | keep |
| Shorts shelf and individual Shorts | keep (open in the regular player) |
| "People also watched", "New for you" | hide |
| "Related searches" | hide |
| "Latest news" | hide |
| Sponsored results | hide |

## Channel page

| Element | |
|---|---|
| Banner, avatar, name, subscriber count, description | keep |
| Channel links | keep |
| Subscribe | keep |
| "Join" | keep |
| Home tab | hide – channel opens directly on "Videos" |
| Videos, Shorts, Live, Podcasts, Playlists tabs | keep (Shorts in the regular player) |
| Posts/Community tab | hide |
| Store tab | keep |
| Channel search | keep |
| Sorting | keep |
| Autoplaying channel trailer | hide |
| Merch shelf | hide |
| Featured channels | hide |

## "You" section

| Element | |
|---|---|
| "You" overview, history, playlists, watch later, liked videos | keep |
| Your videos, downloads | keep |
| Recommended videos below playlists | hide |

## Blocked pages (redirect to home)

- `/feed/subscriptions` (subscription feed)
- Explore, trending, gaming, news, etc.

## Mobile only (m.youtube.com)

All desktop rules apply here as well. Additionally:

| Element | |
|---|---|
| Bottom bar: Home, Shorts, Subscriptions | hide |
| Bottom bar: You | keep |
| Comment preview below the video | hide |
| Mini player when navigating away | keep |
| Swiping to the next video in fullscreen | hide |
| Double tap to seek | keep |
| Autoplay in search results while scrolling | hide |
| "Open in app" and Premium banners | hide |
