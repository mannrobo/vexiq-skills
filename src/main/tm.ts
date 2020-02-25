/**
 * Communicates with Tournament Manager (if applicable)
 */

import { ipcMain, WebContents } from "electron";
import Client, { AuthenticatedRole } from "vex-tm-client";

const clients = new Map<number, Client>();

const client = new Client(
  "http://localhost",
  AuthenticatedRole.ADMINISTRATOR,
  ""
);

interface IpcMainEvent {
  frameId: number;
  returnValue: any;
  sender: WebContents;
  reply: (...args: any) => void;
}

ipcMain.on(
  "tm-connect",
  async (event: IpcMainEvent, address: string, password: string) => {
    let client: Client;
    if (clients.has(event.sender.id)) {
      client = clients.get(event.sender.id) as Client;
    } else {
      client = new Client("", AuthenticatedRole.ADMINISTRATOR, "");
    }

    client.address = address;
    client.password = password;

    try {
      await client.connect();
      event.sender.send("tm-connection-successful", {
        divisions: client.divisions.map(({ teams, id, name }) => ({
          teams,
          id,
          name
        })),
        fieldsets: client.fieldsets.map(
          ({ type, name, fields, state, id }) => ({
            type,
            name,
            fields,
            state,
            id
          })
        )
      });
    } catch (e) {
      event.sender.send("tm-connection-error", e);
      console.log(e);
    }
  }
);
