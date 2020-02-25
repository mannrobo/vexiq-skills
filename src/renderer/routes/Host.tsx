import * as React from "react";
import {
  Row,
  Col,
  Typography,
  Layout,
  Form,
  Icon,
  Input,
  Button,
  Alert,
  notification,
  List,
  Checkbox
} from "antd";
import { networkInterfaces, NetworkInterfaceInfoIPv4 } from "os";
import { Switch, Route } from "react-router";
import { HashRouter as Router } from "react-router-dom";

import { ipcRenderer, IpcMessageEvent } from "electron";
import Fieldset, { Field } from "vex-tm-client/out/Fieldset";
import Division from "vex-tm-client/out/Division";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const lanInterfaces = networkInterfaces()["en0"].filter(
  lan => lan.family === "IPv4"
) as NetworkInterfaceInfoIPv4[];

interface Fieldcontrol {
  fieldset: Fieldset;
  team: string;
  type: "DRIVER" | "PROGRAMMING";
  use: boolean;
  client: {
    name: string;
    id: string;
  } | null;
}

export default class HostRoute extends React.Component {
  state = {
    tm: {
      connected: false,
      connecting: false,
      address: sessionStorage.getItem("tm-address") || "",
      password: sessionStorage.getItem("tm-password") || "",
      error: ""
    },
    event: {
      divisions: [] as Division[],
      fieldsets: [] as Fieldset[]
    },
    clients: [] as { name: string; id: string }[],
    fieldControl: [] as Fieldcontrol[]
  };

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({
      tm: {
        ...this.state.tm,
        connecting: true,
        error: ""
      }
    });

    ipcRenderer.send(
      "tm-connect",
      "http://" + this.state.tm.address,
      this.state.tm.password
    );
    ipcRenderer.on(
      "tm-connection-successful",
      (e: IpcMessageEvent, event: { fieldsets: Fieldset[] }) => {
        const fieldControl: Fieldcontrol[] = [];

        for (let fieldset of event.fieldsets.filter(
          fs => fs.type == 2
        ) as Fieldset[]) {
          const field = fieldset.fields[0];
          fieldControl.push({
            fieldset,
            team: "",
            type: "DRIVER",
            use: true,
            client: null
          });
        }

        this.setState({
          tm: {
            ...this.state.tm,
            connecting: false,
            connected: true
          },
          event,
          fieldControl
        });

        window.location.hash = "#/host/connected";
        sessionStorage.setItem("tm-address", this.state.tm.address);
        sessionStorage.setItem("tm-password", this.state.tm.password);
      }
    );
  };

  constructor(props: {}) {
    super(props);

    ipcRenderer.send("ws-server-start");
    ipcRenderer.send("ws-clients-refresh");
    ipcRenderer.on(
      "ws-client-connect",
      (event: IpcMessageEvent, id: string) => {
        notification.open({
          message: "Client Connected",
          description: `${id}`
        });
        this.setState({
          clients: [
            ...this.state.clients,
            {
              id,
              name: id,
              fields: []
            }
          ]
        });
      }
    );
  }

  render() {
    if (
      window.location.hash == "#/host/connected" &&
      !this.state.tm.connected
    ) {
      window.location.hash = "#/host";
    }

    return (
      <Layout id="host">
        <header>
          <p>
            {lanInterfaces.length > 0
              ? lanInterfaces.map(lan => `ws://${lan.address}:8080`).join(", ")
              : "No LAN Addresses Found"}{" "}
            ({this.state.clients.length} clients connected)
          </p>
          <p>
            {!this.state.tm.connected ? "Not " : ""}Connected to Tournament
            Manager
          </p>
        </header>
        <Row>
          <Col span={this.state.tm.connected ? 1 : 6}></Col>
          <Col span={12}>
            <Router basename="/host">
              <Switch>
                <Route path="/connected">
                  <List
                    dataSource={this.state.fieldControl}
                    itemLayout="horizontal"
                    renderItem={item => (
                      <List.Item key={item.fieldset.id}>
                        <List.Item.Meta
                          avatar={<Checkbox checked={item.use} />}
                          title={item.fieldset.fields[0].name}
                          description={item.type}
                        />
                      </List.Item>
                    )}
                  />
                </Route>
                <Route path="/">
                  <p>Connect to Tournament Manager</p>
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    {this.state.tm.error ? (
                      <Alert message={this.state.tm.error} type="error" />
                    ) : null}
                    <Form.Item>
                      <Input
                        addonBefore={"http://"}
                        placeholder="Address"
                        onInput={event =>
                          this.setState({
                            tm: {
                              ...this.state.tm,
                              address: (event.target as HTMLInputElement).value
                            }
                          })
                        }
                        value={this.state.tm.address}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        type="password"
                        placeholder="Password"
                        onInput={event =>
                          this.setState({
                            tm: {
                              ...this.state.tm,
                              password: (event.target as HTMLInputElement).value
                            }
                          })
                        }
                        value={this.state.tm.password}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={this.state.tm.connecting}
                      >
                        Connect
                      </Button>
                    </Form.Item>
                  </Form>
                </Route>
              </Switch>
            </Router>
          </Col>
        </Row>
      </Layout>
    );
  }
}
