# Instagram – Specification

Goal: only see what friends post. Search for people. Open posts someone sends you without scrolling on afterwards. Applies to desktop (Chrome/Brave) and mobile (Safari).

## General (everywhere)

- Home `/` → redirect to the following feed `/?variant=following` (chronological, followed accounts only)
- Reels open as regular posts: `/reel/ID` → `/p/ID`
- Ads ("Sponsored") and suggestions ("Suggested for you" etc.): hidden
- "Open in app" banner: hidden

## Blocked pages (redirect to the following feed)

- `/reels/` (Reels feed)
- `/explore/people/` (people suggestions)
- `/explore/tags/…`, `/explore/locations/…` (posts from strangers)
- `/explore/` on desktop (on mobile the page stays, but only the search field)

## Sidebar / bottom bar

| Element | |
|---|---|
| Home | keep (opens the following feed) |
| Search | keep |
| Explore | hide (mobile: search field only) |
| Reels | hide |
| Threads link | hide |
| Messages, notifications, create, profile, "More" | keep |

## Following feed

| Element | |
|---|---|
| Stories | keep |
| Posts from followed accounts | keep |
| Suggested posts | hide |
| "Suggested for you" (accounts) | hide |
| Ads | hide |

## Search

| Element | |
|---|---|
| Search results | keep |
| "Recent searches" list | keep |
| Explore grid (mobile) | hide |

## Posts

| Element | |
|---|---|
| Like, comment, share, save, like count | keep |
| Comments | keep |
| "More posts from …" below | hide |

## Profiles

| Element | |
|---|---|
| Avatar, name, bio, follower counts | keep |
| Follow, send message | keep |
| Story highlights | keep |
| Posts, Reels, Tagged tabs | keep (reels as regular posts) |
| "Similar accounts" suggestions | hide |

## Messages

| Element | |
|---|---|
| Chats | keep |
| Notes | keep |
| Suggested people | hide |
