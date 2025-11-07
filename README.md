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
- Added components to build the website such as Button, Card
- Added the main menu page
  
## v0.2.0 (2025-10-24)
- Authentication Context for Login and 2FA

## v0.2.0 (2025-10-27)
- Sign Up Page

## v0.3.0 (2025-11-06)
- Added discover page with support for infinite scrolling
- When the enter the discover page, front end will request 10 items from back end using the api call '/discover?page='. Every new fetch the page value is increased by 1.
- Backend needs to response with the structure defined in DiscoverContext.tsx.
- Change the component "login" to "signin" to match with "signup"
- Change api call to back end from '/login' to '/signin', '/sign-up' to '/signup
- Added more comments to make code clearer

## v0.3.1 (2025-11-07)
- Fix a small bug thats causing multiple fetch on discover page.