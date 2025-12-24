import { createServer } from 'http';
import app from "./app";
import { AppDataSource } from "./data-source";
import { initializeWebSocket } from "./services/websocket.service";

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    // Initialize WebSocket
    initializeWebSocket(httpServer);
    console.log("WebSocket initialized");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });
