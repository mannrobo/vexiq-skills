import * as React from "react";
import { Row, Col, Typography, Button } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

export default () => (
  <Row id="index">
    <Col span={6} />
    <Col span={12} className="content">
      <img src="../public/images/viq_button.png" />
      <Title level={3}>South Carolina VEX IQ State Championship</Title>

      <Button type="primary" size="large" block>
        <Link to="/host">Host</Link>
      </Button>

      <Button size="large" block>
        <Link to="/client">Client</Link>
      </Button>

      <Button size="large" block>
        <Link to="/display">Display</Link>
      </Button>
    </Col>
  </Row>
);
