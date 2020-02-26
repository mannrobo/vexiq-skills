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

export default class ClientRoute extends React.Component {
  state = {
    iq: {
      error: "",
      address: "",
      name: "",
      connecting: false,
      connected: false
    }
  };

  ws: WebSocket;

  handleSubmit() {
    this.ws = new WebSocket(`ws://${this.state.iq.address}`);

    this.ws.addEventListener("open", () => {
      this.ws.send(
        JSON.stringify({
          action: "SET_NAME",
          name: this.state.iq.name
        })
      );
    });
  }

  render() {
    return (
      <Router basename="/host">
        <Switch>
          <Route path="/">
            <p>Connect to VEX IQ SKILLS MANAGEMENT</p>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              {this.state.iq.error ? (
                <Alert message={this.state.iq.error} type="error" />
              ) : null}
              <Form.Item>
                <Input
                  addonBefore={"ws://"}
                  placeholder="Address"
                  onInput={event =>
                    this.setState({
                      tm: {
                        ...this.state.iq,
                        address: (event.target as HTMLInputElement).value
                      }
                    })
                  }
                  value={this.state.iq.address}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Your Client Name"
                  onInput={event =>
                    this.setState({
                      tm: {
                        ...this.state.iq,
                        name: (event.target as HTMLInputElement).value
                      }
                    })
                  }
                  value={this.state.iq.name}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={this.state.iq.connecting}
                >
                  Connect
                </Button>
              </Form.Item>
            </Form>
          </Route>
        </Switch>
      </Router>
    );
  }
}
