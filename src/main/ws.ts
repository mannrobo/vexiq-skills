/**
 * Handles WebSocket connections TO the server (for display communication)
 */

import { Server } from "ws";
import { ipcMain, WebContents } from "electron";
import { IpcMainEvent } from "./tm";
import { IncomingMessage } from "http";

const clients = new Map<string, WebSocket>();

let host: WebContents;
function startServer(event: IpcMainEvent) {
  const server = new Server({ port: 8080 });
  server.on("connection", connect(event));
}

const connect = (event: IpcMainEvent) => (
  socket: WebSocket,
  request: IncomingMessage
) => {
  const id =
    Math.random()
      .toString(36)
      .substring(2, 5) +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 4);
  clients.set(id, socket);

  console.log("connected", id);
  socket.addEventListener("close", () => {
    console.log("disconnected", id);
    event.sender.send("ws-client-disconnect", id);
    clients.delete(id);
  });

  socket.addEventListener("message", evt => {
    console.log(`${id}: `, evt.data);
    event.sender.send("ws-client-message", id, JSON.parse(evt.data));
  });

  event.sender.send("ws-client-connect", id);
};

ipcMain.once("ws-server-start", startServer);

ipcMain.on("ws-clients-refresh", (event: IpcMainEvent) => {
  for (let id of clients.keys()) {
    event.sender.send("ws-client-connect", id);
  }
});
