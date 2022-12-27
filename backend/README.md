# Messaging app backend

## Tech-stack used for backend:
- Express
- Socket.IO server

## Installation:
1. Clone the project onto your local machine. Preferably, keep the backend and the frontend folders inside a single folder.
2. Open terminal and navigate to the backend directory.
3. Run `npm install` to install all the required dependencies.
4. In the same terminal, run `npm run dev` to get the backend up and running.
5. Please ensure that you have a websocket enabled browser and you have disabled all ad-blockers as they may interfere with the connections.

## Features:
1. Real-time chat with Socket.IO (a library implementation based on websocket).
2. Real-time updates if a user/agent joins a room, thereby indicating other agents that there is a conversation going on and they can concentrate on other users/tasks.
