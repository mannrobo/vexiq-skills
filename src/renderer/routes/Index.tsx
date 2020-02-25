import * as React from "react";
import { Row, Col } from "antd";

export default () => (
  <Row id="index">
    <img src="../public/images/viq_button.png" />
    <Col span={8} />
    <Col span={16}>
      <p>Hello World</p>
    </Col>
  </Row>
);
