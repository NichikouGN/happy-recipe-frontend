# Introduction
This repository contains the front end of the website "Happy Recipe", a project for the subject "Introduction to Software Engineering

# Collaborators
- Trung Kien (Lead) - 23120055
- Thien Nhan (Tester) - 23120064
- Tan Loc (Dev) - 23120057
- Dinh Luan (Designer) - 23120059
- Nhat Khang (Dev) - 23120050

# How to use
To execute the front end, type 'npm run dev' on the into the console and open any search engine and access [localhost](localhost:5173)

# Version
## v0.1.0 (2025-10-14)
- Added components to build the website such as Button, Card.
- Added the main menu page.
  
## v0.2.0 (2025-10-24)
- Authentication Context for Login and 2FA.

## v0.2.0 (2025-10-27)
- Sign Up Page.

## v0.3.0 (2025-11-06)
- Added discover page with support for infinite scrolling.
- When the enter the discover page, front end will request 10 items from back end using the api call '/discover?page='. Every new fetch the page value is increased by 1.
- Backend needs to response with the structure defined in DiscoverContext.tsx.
- Change the component "login" to "signin" to match with "signup".
- Change api call to back end from '/login' to '/signin', '/sign-up' to '/signup.
- Added more comments to make code clearer.

## v0.3.1 (2025-11-07)
- Fix a small bug thats causing multiple fetch on discover page.
  
## v0.4.0 (2025-11-11)
- Updated the UI of the discover page.
- Added the ability to react, bookmark a given post.
- Upon reaction, front end sends a request to backend with the access token, type of reaction (isbookmarked for bookmark), postid.

## v0.4.1 (2025-11-20)
- Moved the manual user reactions and bookmark to using tanstack query.
- Changed the navbar to take up full width of the screen.
- Change the homepage to showing a list of popular dishes instead of ranked post.

## v0.5.0 (2025-11-23)
- Added /post?id page to get a detailed view of the post.
- Support post sharing function via URL.
- Display all the post information including the description and steps.
- Added animation for /home and /post page.

## v0.5.1 (2025-11-25)
- Added bookmark and reactions to the /post page.
- Data now synced between /discover page and /post page.
  
## v0.5.2 (2025-11-30)
- Added comments to the /post page with support for viewing replies.

## v0.6.0 (2025-12-01)
- Added the search page that allows basic searching and viewing search results.
- Made the comment lines prettier in /post.

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
  