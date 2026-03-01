# Real-Time Collaborative Drawing Game

A multiplayer, real-time collaborative canvas application that allows multiple users to draw, erase, and interact on a shared digital whiteboard simultaneously. 

## 🏗️ Architecture & Technologies

This project uses a lightweight client-server architecture, communicating entirely over WebSockets for fast, bi-directional, real-time updates.

### Frontend
* **`p5.js`**: Handles the heavy lifting for canvas rendering, capturing continuous mouse drags, and plotting curves.
* **Vanilla JavaScript (`script.js` & `curve.js`)**: Manages the application state, including the `undoStack`, current stroke properties (color and weight), and constructing `Curve` objects.
* **HTML/CSS**: Provides the structure and flexible UI for the toolbars (color picker, size slider, action buttons).

### Backend
* **Node.js & Express**: Serves the foundational backend structure.
* **`ws` (WebSockets)**: Creates a persistent connection with all active clients. The server acts as a centralized relay—when a user finishes a stroke or triggers an action, the server broadcasts that specific event or JSON payload to all other connected clients.

## ✨ Features

* **Real-Time Synchronization**: Every stroke drawn by a user is instantly serialized, sent to the server, and broadcasted to everyone else in the session.
* **Custom Brush Mechanics**: 
  * Select custom colors using the native HTML color picker.
  * Adjust brush thickness dynamically via the size slider.
* **Smart Erasing**: Right-clicking and dragging acts as an eraser by drawing strokes that match the canvas background color (`#F5F5F5`).
* **Action History (Undo/Redo)**: Maintains a local stack of your strokes, allowing you to seamlessly undo mistakes or redo actions. These state changes are also synchronized across the server.
* **Global Clear**: A single click wipes the slate clean for everyone connected.

## 🚀 Setup & Installation

To run this application locally, ensure you have Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/helloswayamshah/drawing_game.git](https://github.com/helloswayamshah/drawing_game.git)
   cd drawing_game
   ```

2. **Install Dependencies:**
Install the required Node packages (`express`, `ws`, `socket.io`):
   ```bash
   npm install
   ```


3. **Update the WebSocket URL (Local Testing):**
By default, the client is configured to connect to a production Render URL. To test locally, open `script.js` and change the socket connection string:
   ```javascript
   // Change this:
   socket = new WebSocket("wss://drawing-game-g8gh.onrender.com");
   // To this:
   socket = new WebSocket("ws://localhost:3000");
   ```


4. **Start the Server:**
   ```bash
   node server.js
   ```


*The server will start on Port 3000.*
5. **Open the App:**
Open `index.html` in your web browser. Open it in multiple windows to see the real-time collaboration in action!

## 🎮 How to Play / Usage

* **Draw**: Left-click and drag anywhere on the canvas.
* **Erase**: Right-click and drag to erase parts of the drawing.
* **Change Color**: Click the color swatch at the bottom to open the color picker.
* **Change Brush Size**: Use the slider at the bottom of the screen.
* **Undo/Redo/Clear**: Use the corresponding buttons to manage the canvas state.

## 👨‍💻 Author

Created by Swayam Shah
