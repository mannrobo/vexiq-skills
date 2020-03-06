import * as React from "react";
import { Row, Col, Typography, Layout, Button } from "antd";
import { Switch, Route } from "react-router";
import { HashRouter as Router } from "react-router-dom";

import { ipcRenderer, IpcMessageEvent } from "electron";
import Fieldset, { Field } from "vex-tm-client/out/Fieldset";
import Division from "vex-tm-client/out/Division";

import { DisplayMessage } from "./Client";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

export default class DisplayRoute extends React.Component {
  openDisplay = () => {
    window.open("#/");
  };

  state = {
    timerEnable: false,
    teamInfo: [
      { number: "", name: "", skill: "Driver" },
      { number: "", name: "", skill: "Driver" },
      { number: "", name: "", skill: "Driver" }
    ],
    timeRemaining: 60
  };

  constructor(props: any) {
    super(props);

    window.addEventListener("message", event => {
      const data = event.data as DisplayMessage;

      switch (data.action) {
        case "timer-set-enable": {
          this.setState({
            timerEnable: data.enable
          });
          break;
        }

        case "timer-set-time": {
          this.setState({
            timeRemaining: data.time
          });
          break;
        }

        case "set-team-information": {
          let teams = this.state.teamInfo;
          teams[data.slot] = {
            number: data.number,
            name: data.name,
            skill: data.skill
          };

          this.setState({
            teamInfo: teams
          });

          break;
        }
      }
    });
  }

  render() {
    return (
      <Layout id="display">
        <Header className="titlebar">
          <img src="../public/images/display/scvex.png" alt="" />
          <img src="../public/images/display/vexiq.png" alt="" />
        </Header>
        <Row className="content">
          <Col span={2}></Col>
          <Col span={10} className="team-list">
            {this.state.teamInfo.map(team => (
              <section className="team">
                <Title>{team.number}</Title>
                <div className="team-info">
                  <Title level={2}>{team.name}</Title>
                  <Title level={4}>{team.skill}</Title>
                </div>
              </section>
            ))}
          </Col>
          {this.state.timerEnable ? (
            <Col span={10} className="time-indicator">
              <Title id="time-remaining">1:00</Title>
            </Col>
          ) : null}
          <Col span={2}></Col>
        </Row>
        <img
          src="../public/images/display/gear_bottom.png"
          alt=""
          className="gear-bottom"
        />
      </Layout>
    );
  }
}
