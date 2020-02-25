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
  Alert
} from "antd";
import { networkInterfaces, NetworkInterfaceInfoIPv4 } from "os";
import Client, { AuthenticatedRole } from "vex-tm-client";
import { Switch, Route } from "react-router";
import { HashRouter as Router } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const tmClient = new Client(
  "http://localhost",
  AuthenticatedRole.ADMINISTRATOR,
  ""
);

const lanInterfaces = networkInterfaces()["en0"].filter(
  lan => lan.family === "IPv4"
) as NetworkInterfaceInfoIPv4[];

export default class HostRoute extends React.Component {
  state = {
    tm: {
      connected: false,
      connecting: false,
      address: "",
      password: "",
      error: ""
    }
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

    tmClient.address = "http://" + this.state.tm.address;
    tmClient.password = this.state.tm.password;

    console.log(tmClient);

    try {
      await tmClient.connect();

      this.setState({
        ...this.state.tm,
        connected: true,
        connecting: false,
        error: ""
      });

      window.location.replace("/host/connected");
    } catch (e) {
      console.log(e);
      this.setState({
        tm: {
          ...this.state.tm,
          connected: false,
          connecting: false,
          error:
            "Could not check to Tournament Manager, check credentials and try again"
        }
      });
    }
  };

  render() {
    return (
      <Layout id="host">
        <header>
          <p>
            {lanInterfaces.length > 0
              ? lanInterfaces.map(lan => `ws://${lan.address}`).join(", ")
              : "No LAN Addresses Found"}
          </p>
          <p>
            {!this.state.tm.connected ? "Not " : ""}Connected to Tournament
            Manager
          </p>
        </header>
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <Router basename="/host">
              <Switch>
                <Route path="/connected">
                  <p>Connected to Tournament Manager</p>
                </Route>
                <Route path="/">
                  <p>Connect to Tournament Manager</p>
                  <Form layout="inline" onSubmit={this.handleSubmit}>
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
