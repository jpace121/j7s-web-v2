import { useState } from "react";
import { create } from "zustand";
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

const useStore = create((set, get) => ({
  toDisplayColors: ["green", "green", "green", "green", "green"],
  toDisplayBrightness: [0.0, 0.0, 0.0, 0.0, 0.0],
  toSendColors: ["green", "green", "green", "green", "green"],
  toSendBrightness: [0.0, 0.0, 0.0, 0.0, 0.0],

  setToDisplayColor: (index, color) => {
    const colorCopy = get().toDisplayColors.slice();
    colorCopy[index] = color;
    set((state) => ({
      toDisplayColors: colorCopy,
    }));
  },
  setToDisplayBrightness: (index, brightness) => {
    const brightnessCopy = get().toDisplayBrightness.slice();
    brightnessCopy[index] = brightness;
    set((state) => ({
      toDisplayBrightness: brightnessCopy,
    }));
  },
  setToSendColor: (index, color) => {
    const colorCopy = get().toSendColors.slice();
    colorCopy[index] = color;
    set((state) => ({
      toSendColors: colorCopy,
    }));
  },
  setToSendBrightness: (index, brightness) => {
    const brightnessCopy = get().toSendBrightness.slice();
    brightnessCopy[index] = brightness;
    set((state) => ({
      toSendBrightness: brightnessCopy,
    }));
  },
}));

function AppNav() {
  return (
    <Navbar bg="light" variant="light" expand="sm" className="py-0">
      <Container>
        <Navbar.Brand>j7s</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

function Display() {
  const displayColors = useStore((state) => state.toDisplayColors);
  const displayBrightness = useStore((state) => state.toDisplayBrightness);
  return (
    <Card className="padded-card">
      Colors: {JSON.stringify(displayColors, null, 2)}
      Brightness: {JSON.stringify(displayBrightness, null, 2)}
    </Card>
  );
}

function BrightnessSelect(props) {
  const setToSendBrightness = useStore((state) => state.setToSendBrightness);
  const toSendBrightness = useStore((state) => state.toSendBrightness);

  let onChange = (e) => {
    setToSendBrightness(props.selectedLight, e.target.value);
  };
  const brightness = toSendBrightness[props.selectedLight];
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

  let onChange = (e) => {
    setToSendColor(props.selectedLight, e.target.value);
  };
  const color = toSendColors[props.selectedLight];
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

function LightSelect(props) {
  let onChange = (e) => {
    props.setSelectedLight(parseInt(e.target.value));
  };
  return (
    <FloatingLabel label="Light">
      <Form.Select onChange={onChange} value={props.selectedLight}>
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
  const [selectedLight, setSelectedLight] = useState(0);
    const onSubmit = (e) => {
    };
  return (
    <Card className="padded-card">
      <LightSelect
        selectedLight={selectedLight}
        setSelectedLight={setSelectedLight}
      />
      <ColorSelect selectedLight={selectedLight} />
      <BrightnessSelect selectedLight={selectedLight} />
      <Button variant="primary" onClick={onSubmit}> Send</Button>
    </Card>
  );
}

function App() {
  return (
    <div>
      <AppNav />
      <Container>
        <Display />
        <InputForm />
      </Container>
    </div>
  );
}

export default App;
