import { useState } from "react";
import { useStore } from "./Store.js";
import { AppCanvas } from "./SceneView.jsx";
import { sendDesiredState } from "./Api.js";
import { SocketWrapper } from "./SocketContext.jsx";
import {
  Navbar,
  Container,
  Row,
  Col,
  Card,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function AppNav() {
  return (
    <Navbar bg="light" variant="light" expand="sm" className="py-0">
      <Container>
        <Navbar.Brand>j7s</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

function DebugDisplay() {
  const displayColors = useStore((state) => state.toDisplayColors);
  const displayBrightness = useStore((state) => state.toDisplayBrightness);
  return (
    <Card className="padded-card">
      <p>Colors: {JSON.stringify(displayColors, null, 2)}</p>
      <p>Brightness: {JSON.stringify(displayBrightness, null, 2)}</p>
    </Card>
  );
}

function BrightnessSelect(props) {
  const setToSendBrightness = useStore((state) => state.setToSendBrightness);
  const toSendBrightness = useStore((state) => state.toSendBrightness);
  const toSendIndex = useStore((state) => state.toSendIndex);

  let onChange = (e) => {
    setToSendBrightness(toSendIndex, e.target.value);
  };
  const brightness = toSendBrightness[toSendIndex];
  return (
    <FloatingLabel label="Brightness">
      <Form.Control
        size="sm"
        type="number"
        value={brightness}
        onChange={onChange}
        min={0.0}
        step={0.1}
        max={1.0}
      />
    </FloatingLabel>
  );
}

function ColorSelect(props) {
  const setToSendColor = useStore((state) => state.setToSendColor);
  const toSendColors = useStore((state) => state.toSendColors);
  const toSendIndex = useStore((state) => state.toSendIndex);

  let onChange = (e) => {
    setToSendColor(toSendIndex, e.target.value);
  };
  const color = toSendColors[toSendIndex];
  return (
    <FloatingLabel label="Color">
      <Form.Select onChange={onChange} value={color}>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="white">White</option>
        <option value="red">Red</option>
        <option value="lime">Lime</option>
        <option value="aqua">Aqua</option>
        <option value="off">Off</option>
      </Form.Select>
    </FloatingLabel>
  );
}

function LightSelect() {
  const setToSendIndex = useStore((state) => state.setToSendIndex);
  const toSendIndex = useStore((state) => state.toSendIndex);
  let onChange = (e) => {
    setToSendIndex(parseInt(e.target.value));
  };
  return (
    <FloatingLabel label="Light">
      <Form.Select onChange={onChange} value={toSendIndex}>
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
        <option value="5">6</option>
      </Form.Select>
    </FloatingLabel>
  );
}

function InputForm() {
  const onSubmit = async (e) => {
    await sendDesiredState();
    e.stopPropagation();
  };
  return (
    <Card className="padded-card">
      <LightSelect />
      <ColorSelect />
      <BrightnessSelect />
      <Button variant="primary" onClick={onSubmit}>
        Send
      </Button>
    </Card>
  );
}

function App() {
  return (
    <div>
      <AppNav />
      <SocketWrapper>
        <Container>
          <Row>
            <Col>
              <AppCanvas />
              <DebugDisplay />
            </Col>
            <Col>
              <InputForm />
            </Col>
          </Row>
        </Container>
      </SocketWrapper>
    </div>
  );
}

export default App;
