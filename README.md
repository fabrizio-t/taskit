# TasKit

<p align="center">
  <img src="images/logo.png" />
</p>

TasKit is a Progressive Web Application designed to help individuals and teams stay productive and organized. It features an intuitive interface for creating individual and team projects, managing tasks and todo lists, tracking progress, and filtering tasks by tags. The progress of the tasks which include the "milestone" tag will be accounted for calculating the overall progress of each project.
TasKit is built with the latest tech stack of React, Node.js, and MongoDB, making it fast and reliable.

## Screenshots

<p align="center">
  <img src="images/10.png" />
</p>

## Installation

### Prerequisites
Before installing the project, you need to have the following software installed on your machine:
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/download-center)

### Setup
1. Clone the repository
```
git clone https://github.com/fabrizio-t/taskit.git
```
2. Navigate to the project's root directory
```
cd TasKit
```
3. Create a `.env` file in the `Server` directory of the project
```
cd Server
touch .env
```
4. Add the following environment variables to the `.env` file
```
PORT=
CLIENT_ORIGIN_URL=
AUTH0_AUDIENCE=
AUTH0_DOMAIN=
DB_USER=
DB_PASSWORD=
DB_URL=
```
5. Install project dependencies
```
npm install
```
6. Run the server
```
npm start
```
7. Create a `.env` file in the `Client` directory
```
cd ../Client
touch .env
```
8. Add the following environment variables to the `.env` file
```
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=
REACT_APP_AUTH0_CALLBACK_URL=
REACT_APP_API_SERVER_URL=
REACT_APP_AUTH0_AUDIENCE=
```
9. Install project dependencies
```
npm install
```
6. Run the client
```
npm start
```

## Tech Stack
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redux](https://redux.js.org/)

