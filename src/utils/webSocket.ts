/* eslint-disable @typescript-eslint/no-explicit-any */
import WebSocket from 'ws';
import { wss } from '../index'; // Assuming WebSocket server instance

export const sendWsMessage = (type: string, data: any) => {
    const message = JSON.stringify({ type, data });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};