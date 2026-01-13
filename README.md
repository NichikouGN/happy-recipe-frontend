# Introduction

This repository contains the front end of the website "Happy Recipe", a project for the subject "Introduction to Software Engineering

# Collaborators

- Trung Kien (Lead) - 23120055
- Thien Nhan (Tester) - 23120064
- Tan Loc (Dev) - 23120057
- Dinh Luan (Designer) - 23120059
- Nhat Khang (Dev) - 23120050

# How to setup

1. Open up the terminal and type in

```bash
git clone https://github.com/NichikouGN/happy-recipe-frontend.git
```

2. After that, run

```bash
npm install
```

3. Change the .env file to point to the backend

```js
VITE_API_URL = "http://localhost:4000"; //default
```

4. Start up the server

```bash
npm run dev
```

# Version

## v1.0.0 (2026-01-13)

- Added fetching guard for profile page.

## v1.0.0 - RC (2026-01-13)

- Move some image files to public space for build version to access.
- Split Post context into individual components to prevent fetching of discovery outside of discover page.
- Cleaned up the code base (removing console log, unneeded toast).
- Added fetch guard to discover page to prevent duplicate fetching.

## v0.11.2 (2026-01-12)

- Added the User Error for unknown user Id.
- Added Post Skeleton to display when post is being loaded.
- Added Post Error to display when post doesn't exist.
- Changed some styles in certain pages.
- Fixed user page not displaying posts.
- Fixed upload page be able to upload files that are not images.
- Added hard limits to fields like title, description, duration, servings and steps in the upload page.
- Fixed abnormal routing on signup page.
- Fixed not showing error when signing up with an already existing email.

## v0.11.1 (2026-01-11)

- Fixed the issue with discover page not trigger request new accesstoken when expired.

## v0.11.0 (2026-01-10)

- Added ability to delete your own post.
- Added related posts to post details.
- Added a new notifications page.

## v0.10.2 (2026-01-08)

- Fixed some error with search result for user category.
- Decorate the search results for user.
- Changed home directory to use fixed value for ingredients instead of fetching.
- Added a username field under the display name in the profile and user page.
- Changed the AI chatbot initial message to not be part of the context for the API.
- Small change to various UI elements.
- Fix not being able to send comments under post

## v0.10.1 (2025-12-26)

- Change the edit profile File field to avatar instead of profileImg to match with backend.
- Fixed an issue author image not showing on the post card.
- Added confirmation message when editing profile.

## v0.10.0 (2025-12-23)

- Made changes to post structure to get more info and standardize code as following:
  1. change author to authorName
  2. added authorId, authorImgUrl
- Added author image to card component instead of hard code like before.
- Allow navigating to the user page from /post page and any page that uses the card component.
- Changed card component to allow redirect to user page by clicking author image.
- Added /user page that allow view other users profile including their name, bio, posts uploaded.
- Replace AI button with a search category by post or user
- Added paging for search results
- Update search results to include a category search params. the API will look like /api/search/results?category=A&query=B&page=C
- Update the AI chat to use the new search results URL.

## v0.9.1 (2025-12-21)

- Fixed expired access token not refreshed when uploading post while refresh token is still valid.
- Fixed expired access token not refreshed when uploading user edit information while refresh token is still valid.
- Renamed stepImgURL to stepImgUrl in /upload page.
- Change profileData.avata to profileData.profileImageFile in editProfile.ts.

## v0.9.0 (2025-12-20)

- Overhaul to the /search page. It will now use route instead of state.
- Added /search/results?query route for the search results page.
- Change the search api from ~~/search?query~~ to **/search/results?query**. The interface remains the same.
- Split some of the code block from /profile/edit to its own file to clean up the component.
- Added an AI chatbot to the website.
  1. The AI chatbot toggle button will always be visible and accessible outside of settings, profile settings, sign in, sign out, 2fa and post.
  2. The AI communicate via /api/ai/chat.
  3. The interface that will be sent over contains the chat history with the context size of 10.
  4. The expected interface is the respond with redirect (optional).
  5. Redirect is a button that will perform a search with that query.

## v0.8.2 (2025-12-19)

- Fixed an issue with /profile page stale data.
- Fixed an issue with /profile/edit page missing authorization token.

## v0.8.1 (2025-12-17)

- Fixed an issue with /upload page sending a string instead of an image file.
- Fixed an issue with /profile/edit page sending a string instead of an image file.
- Migrate /signin and /signup to using react-hook-form with zod.

## v0.8.0 (2025-12-17)

- Introduced some small UI color touch up to majority of the page.
- Small change to the homepage UI.
- Rework the UI of the /profile page.
- Added my posts and bookmarks section to view user own post as well as bookmarked posts.
- Added /settings page.
- Added support for dark mode.
- Added /profile/edit page to customize avatar, display name and bio.
- Added routing guards to following url:
  1. /signin, /signup requires unauthorized state.
  2. /2fa requires 2FA state.
  3. /profile/edit, /upload requires authorized state.

## v0.7.1 (2025-12-11)

- Converted majority of react context to zustand.
- The access token is now also stored to local storage beside the refresh token.
- Make error log on console easier to see the source of the error.
- Changed some of the front end route ~~/login~~ -> **/signin**, ~~/authentication~~ -> **/signin/2fa** (API call remains untouched).
- Fixed error of unable to react and bookmark even when logged in.
- Fixed error of not resetting color of reactions/bookmark when logged in/out.

## v0.7.0 (2025-12-05)

- Added a /profile skeleton page.
- Added /upload page that allow user to upload post.
- Added a NotFound page to display 404 error
- Added ability to preview the post before uploading
- Changed tempToken to twoFactorToken to avoid confusion
- Changed endpoint from validate/temp-token to validate/2fa-token
- Changed the name of the 2fa token taken in the signin function from data.tempToken to data.twoFactorToken
- Changed postID to postId and userID to userId
- Changed the shape of userContext and upload page to an object to avoid multiple states
- Other changes to reduce inline styling and class mismatch in css

## v0.6.0 (2025-12-01)

- Added the search page that allows basic searching and viewing search results.
- Made the comment lines prettier in /post.

## v0.5.2 (2025-11-30)

- Added comments to the /post page with support for viewing replies.

## v0.5.1 (2025-11-25)

- Added bookmark and reactions to the /post page.
- Data now synced between /discover page and /post page.

## v0.5.0 (2025-11-23)

- Added /post?id page to get a detailed view of the post.
- Support post sharing function via URL.
- Display all the post information including the description and steps.
- Added animation for /home and /post page.

## v0.4.1 (2025-11-20)

- Moved the manual user reactions and bookmark to using tanstack query.
- Changed the navbar to take up full width of the screen.
- Change the homepage to showing a list of popular dishes instead of ranked post.

## v0.4.0 (2025-11-11)

- Updated the UI of the discover page.
- Added the ability to react, bookmark a given post.
- Upon reaction, front end sends a request to backend with the access token, type of reaction (isbookmarked for bookmark), postid.

## v0.3.1 (2025-11-07)

- Fix a small bug thats causing multiple fetch on discover page.

## v0.3.0 (2025-11-06)

- Added discover page with support for infinite scrolling.
- When the enter the discover page, front end will request 10 items from back end using the api call '/discover?page='. Every new fetch the page value is increased by 1.
- Backend needs to response with the structure defined in DiscoverContext.tsx.
- Change the component "login" to "signin" to match with "signup".
- Change api call to back end from '/login' to '/signin', '/sign-up' to '/signup.
- Added more comments to make code clearer.

## v0.2.0 (2025-10-27)

- Sign Up Page.

## v0.2.0 (2025-10-24)

- Authentication Context for Login and 2FA.

## v0.1.0 (2025-10-14)

- Added components to build the website such as Button, Card.
- Added the main menu page.

```

```
