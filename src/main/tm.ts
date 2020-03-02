/**
 * Communicates with Tournament Manager (if applicable)
 *
 * Acts as a proxy server between DWAB TM and the Render process
 */

import { ipcMain, WebContents } from "electron";
import Client, { AuthenticatedRole } from "vex-tm-client";

const clients = new Map<number, Client>();

export interface IpcMainEvent {
  frameId: number;
  returnValue: any;
  sender: WebContents;
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

      // Set up pass through for all the fieldset events
      for (let fs of client.fieldsets) {
        fs.ws.on("message", data =>
          event.sender.send("tm-fieldset-message", fs.id, data)
        );
      }
    } catch (e) {
      event.sender.send("tm-connection-error", e);
      console.log(e);
    }

    ipcMain.on(
      "tm-fieldset-control",
      async (event: IpcMainEvent, fieldsetID: number, command: {}) => {
        const fieldset = client.fieldsets.find(fc => fc.id == fieldsetID);
        if (!fieldset) return;

        fieldset.ws.send(JSON.stringify(command));
      }
    );
  }
);
