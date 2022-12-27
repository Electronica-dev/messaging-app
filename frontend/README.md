# Messaging app frontend

## Tech-stack used for frontend:
- React.js
- Material UI
- Socket.IO Client
- React Router

## Installation:
1. Clone the project onto your local machine. Preferably, keep the backend and the frontend folders inside a single folder.
2. Open terminal and navigate to the frontend directory.
3. Run `npm install` to install all the required dependencies.
4. In the same terminal, run `npm start nodemon server` to get the frontend up and running.
5. Before moving on to the next step, please ensure that you have a websocket enabled browser and you have disabled all ad-blockers as they may interfere with the connections.
5. Navigate to `https://localhost:3000` for the agent interface and `https://localhost:3000/customer/` for the customer interface.

## Features:
1. Real-time chat with Socket.IO (a library implementation based on websocket).
2. Real-time updates if a user/agent joins a room, thereby indicating other agents that there is a conversation going on and they can concentrate on other users/tasks.
