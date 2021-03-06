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
  openDisplay = () => {
    window.open("#/display");
  };

  render() {
    return (
      <Layout id="client">
        <Row>
          <Col span={2} />
          <Col span={20} className="main">
            <Button type="primary" id="display-open" onClick={this.openDisplay}>
              Open Display
            </Button>
          </Col>
          <Col span={2} />
        </Row>
      </Layout>
    );
  }
}
