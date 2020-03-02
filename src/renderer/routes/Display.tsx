import * as React from "react";
import { Row, Col, Typography, Layout, Button } from "antd";
import { Switch, Route } from "react-router";
import { HashRouter as Router } from "react-router-dom";

import { ipcRenderer, IpcMessageEvent } from "electron";
import Fieldset, { Field } from "vex-tm-client/out/Fieldset";
import Division from "vex-tm-client/out/Division";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

export default class DisplayRoute extends React.Component {
  openDisplay = () => {
    window.open("#/");
  };

  render() {
    return (
      <Layout id="client">
        <Row>
          <Col span={2} />
          <Col span={20} className="main">
            <Title>Skills!</Title>
          </Col>
          <Col span={2} />
        </Row>
      </Layout>
    );
  }
}
