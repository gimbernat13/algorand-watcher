import express from "express";
import http from "http";
import cors from "cors";
import WebSocket, { WebSocketServer } from 'ws';
import watcherRoutes from "./routes/watcher.routes";

const app = express();
const port = 8000;

const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(watcherRoutes);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');

  ws.on('message', (message: string) => {
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


export {wss}
