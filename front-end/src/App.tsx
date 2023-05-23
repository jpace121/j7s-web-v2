import React from "react";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  atom,
  atomFamily,
} from "recoil";
import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import {
  Navbar,
  //Button, // will conflict with react-three-fiber for some reason
  Container,
  Row,
  Col,
  Card,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { Edges } from "@react-three/drei";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const colorAtomFamily = atomFamily({
  key: "colorAtom",
  default: "green",
});

const brightnessAtomFamily = atomFamily({
  key: "brightnessAtom",
  default: 1.0,
});

const selectedLightAtom = atom({
  key: "selectedLightAtom",
  default: -1,
});

const isControllingAtom = atom({
  key: "isControllingAtom",
  default: false,
});

function LoginButton() {
    const onClick = (e:any) => {
    };
    return (
        <button type="button" className="btn btn-outline justify-content-end" onClick={onClick}>
        Login
        </button>
    );
}

function AppNav() {
  return (
    <Navbar bg="light" variant="light" expand="sm" className="py-0">
      <Container>
        <Navbar.Brand>j7s</Navbar.Brand>
        <LoginButton/>
      </Container>
    </Navbar>
  );
}

function ColorSelector(props: any) {
  const [color, setColor] = useRecoilState(
    colorAtomFamily(props.selectedLight)
  );

  let onChange = (e: any) => {
    setColor(e.target.value);
  };

  return (
    <Form.Select onChange={onChange} value={color} disabled={props.disabled}>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
      <option value="white">White</option>
      <option value="red">Red</option>
      <option value="lime">Lime</option>
      <option value="aqua">Aqua</option>
      <option value="off">Off</option>
    </Form.Select>
  );
}

function BrightnessRange(props: any) {
  const [brightness, setBrightness] = useRecoilState(
    brightnessAtomFamily(props.selectedLight)
  );
  let onChange = (e: any) => {
    setBrightness(e.target.value);
  };
  return (
    <FloatingLabel label="Brightness">
      <Form.Control
        size="sm"
        type="number"
        value={brightness}
        onChange={onChange}
        disabled={props.disabled}
        min={0.0}
        step={0.1}
        max={1.0}
      />
    </FloatingLabel>
  );
}

function ColorControls() {
  const selectedLight = useRecoilValue(selectedLightAtom);
  const isControlling = useRecoilValue(isControllingAtom);

  const disabled = selectedLight <= 0 || !isControlling;
  let selectedLightText = selectedLight.toString();
  if (selectedLight < 0) {
    selectedLightText = "N/A";
  }

  return (
    <Card className="padded-card">
      <Form>
        <Row>
          <Col>
            <Form.Label>Selected Light: {selectedLightText}</Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel label="Color">
              <ColorSelector
                selectedLight={selectedLight}
                disabled={disabled}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <BrightnessRange
              selectedLight={selectedLight}
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ControlSelector />
          </Col>
        </Row>
        <Row>
          <Col>
            <Send />
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

function ControlSelector(props: any) {
  const [controlling, setControlling] = useRecoilState(isControllingAtom);
  const onClick = (e: any) => {
    setControlling(!controlling);
  };
  let text = "Take Control";
  if (controlling) {
    text = "Give Control";
  }
  return (
    <button type="button" className="btn btn-outline-primary" onClick={onClick}>
      {text}
    </button>
  );
}

async function send(colors: any[], brightness: any[]) {
    if(colors.length !== brightness.length) {
        console.log("Can't send because color and brightness aren't the same size. ");
        return;
    }
    const length = colors.length;
    for(let inc = 0; inc < length; inc++) {
        const lightState = {
            "color": colors[inc],
            "brightness": brightness[inc]
        };
        const url = `/api/lights/${inc}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers(),
                body: JSON.stringify(lightState)
            });
        } catch(error) {
            console.log(error);
        }
    }
}

function Send(props: any) {
  const controlling = useRecoilValue(isControllingAtom);
  const disabled = !controlling;
  const curColors = [
      useRecoilValue(colorAtomFamily(1)),
      useRecoilValue(colorAtomFamily(2)),
      useRecoilValue(colorAtomFamily(3)),
      useRecoilValue(colorAtomFamily(4)),
      useRecoilValue(colorAtomFamily(5))
  ];
  const curBrightnesses = [
      useRecoilValue(brightnessAtomFamily(1)),
      useRecoilValue(brightnessAtomFamily(2)),
      useRecoilValue(brightnessAtomFamily(3)),
      useRecoilValue(brightnessAtomFamily(4)),
      useRecoilValue(brightnessAtomFamily(5))
  ];
  const click = async (e: any) => {
      if(controlling) {
          await send(curColors, curBrightnesses);
      }
      e.stopPropagation();
  };
  return (
    <button type="button" className="btn btn-success" disabled={disabled} onClick={click}>
      Send
    </button>
  );
}

function j7sColorToThree(j7sColor: String): THREE.Color {
  if (j7sColor === "off") {
    return new Color("black");
  }
  return new Color(j7sColor as any);
}

function IndicatorBox(props: any) {
  const [selectedLight, setSelectedLight] = useRecoilState(selectedLightAtom);
  const boxColor = j7sColorToThree(
    useRecoilValue(colorAtomFamily(props.boxNum))
  );

  const click = (e: any) => {
    if (selectedLight === props.boxNum) {
      setSelectedLight(-1);
    } else {
      setSelectedLight(props.boxNum);
    }
    e.stopPropagation();
  };
  let isSelected = props.boxNum === selectedLight;
  return (
    <mesh rotation={[0, 0, 0]} position={[props.xPos, 0, 0.25]} onClick={click}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={boxColor} />
      <Edges color={"white"} visible={isSelected} />
    </mesh>
  );
}

function GroundPlane() {
  const setSelectedLight = useSetRecoilState(selectedLightAtom);
  let click = (e: any) => {
    setSelectedLight(-1);
    e.stopPropagation();
  };
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} onClick={click}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="silver" transparent={true} opacity={0.3} />
    </mesh>
  );
}

function AppCanvas() {
  return (
    <div style={{ width: "50vw", height: "50vh" }}>
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 5] }}>
        <color attach="background" args={["black"]} />

        <GroundPlane />

        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />

        <IndicatorBox xPos={-2.0} boxNum={1} />
        <IndicatorBox xPos={-1.0} boxNum={2} />
        <IndicatorBox xPos={0.0} boxNum={3} />
        <IndicatorBox xPos={1.0} boxNum={4} />
        <IndicatorBox xPos={2.0} boxNum={5} />
      </Canvas>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <div>
        <AppNav />
        <Container className="py-5">
          <Row>
            <Col>
              <AppCanvas />
            </Col>
            <Col>
              <ColorControls />
            </Col>
          </Row>
        </Container>
      </div>
    </RecoilRoot>
  );
}

export default App;
