# UML2Code

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Setup](#setup)
  - [Project Structure](#project-structure)
- [Contributing](#contributing)
  - [Making Changes](#making-changes)
- [Documents and Artifacts](#documents-and-artifacts)

## Overview

This project was developed as part of my senior project for my computer science undergraduate degree at Cal Poly. It was advised by Dr. Sussan Einakian.

When learning OOP and UML diagramming in CSC 203, the diagram tools had steep learning curves. Also, a UML diagram can give a lot of information on what a new class should look like in code. This project allows users to create UML diagrams in a simpler way and generate template code from that diagram.

## Getting Started

Here is all you need to know to setup this repo on your local machine to start developing!

### Setup

1. Clone this repository `git clone https://github.com/jlaksana/UML2Code.git`
2. Change directories into the `/client` subfolder
3. Run `npm i` in the frontend subfolder of the repository
4. Change directories to `/server` subfolder
5. Run `npm i` in the backend subfolder of the repository
6. Install IDE Extensions
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
7. Enable format on save in your IDE
   1. Click the settings button in the bottom left
   2. Search "formatter" and set your default formatter to Prettier
   3. Search "format on save" and click the checkbox
8. Reach out to an existing developer for environment variables
9. Verify by running `npm run dev` in the frontend folder and `npm start` in the backend folder

### Project Structure

- [.github](./github/) Github Actions CI/CD
- [client](./client/) Root folder for React app
  - [public](./client/public/) Public assets
  - [src](./client/src/) Frontend code
    - [assets](./client/src/assets/) Assets for client
    - [components](./client/src/components/) All React components
    - [styles](./client/src/styles/) All CSS
    - [tests](./client/tests/) All test cases for components
- [server](./server/) Root folder for backend API - `index.js` Top level file
  - [controllers](./server/controllers/) Controllers/business logic for each API endpoint
  - [middleware](./server/middleware/) Middleware functions for endpoints
  - [models](./server/models/) Schema definitions for data
  - [routes](./server/routes/) Express endpoint definitions and controllers
  - [tests](./server/tests/) All test cases for functions

## Contributing

Here are all of the steps you should follow whenever contributing to this repo!

### Making Changes

1. Before you start making changes, always make sure you're on the main branch, then `git pull` and `npm i` on both frontend and backend to make sure your code is up to date
2. Create a branch `git checkout -b <name-of-branch>`
3. Make changes to the code
4. `npm run test` in the backend and frontend subfolder to ensure code standards. (running `npx run lint-write` will fix most of the styling errors)

## Documents and Artifacts

- [UI Prototype on Figma](https://www.figma.com/file/xs4spLyjIv5bM4afsPFtTR/UML2Code?node-id=0%3A1&t=HrTiFK91b7cRWDap-1)
- [ER Diagram](https://drive.google.com/file/d/1DVN_Lci2pZqO_taoBX7lvLdC9Uc51-mb/view?usp=sharing)
