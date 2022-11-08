import React, { useMemo, useState } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue, atom } from "recoil";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Navbar,
  //Button, // will conflict with react-three-fiber for some reason
  Container,
  Row,
  Col,
  Card,
  Form,
  FloatingLabel,
  Modal,
} from "react-bootstrap";
import { OrbitControls } from "@react-three/drei";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const xValue = atom({
  key: "xValue",
  default: 0.0,
});

const yValue = atom({
  key: "yValue",
  default: 0.0,
});

const resetCamera = atom({
  key: "resetCamera",
  default: false,
});

function AppNav() {
  return (
    <Navbar bg="light" variant="light" expand="sm" className="py-0">
      <Container>
        <Navbar.Brand>Explore!</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

function MovementControls() {
  const [xState, setXState] = useRecoilState(xValue);
  const [yState, setYState] = useRecoilState(yValue);
  const [resetCameraState, setResetCameraState] = useRecoilState(resetCamera);

  let onXChange = (e: any) => {
    setXState(e.target.value);
  };
  let onYChange = (e: any) => {
    setYState(e.target.value);
  };
  let onButtonClick = () => {
    setResetCameraState(!resetCameraState);
  };

  return (
    <Card className="padded-card">
      <Form>
        <Row>
          <Col>
            <Form.Label>Red Square Position:</Form.Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel label="x(m)">
              <Form.Control
                size="sm"
                type="number"
                value={xState}
                onChange={onXChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <FloatingLabel label="y(m)">
              <Form.Control
                size="sm"
                type="number"
                value={yState}
                onChange={onYChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onButtonClick}
            >
              Reset Camera Position
            </button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

function CameraResetNode() {
  // eslint-disable-next-line
  let resetState = useRecoilValue(resetCamera);
  const camera = useThree((state) => state.camera);
  useMemo(() => {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    // eslint-disable-next-line
  }, [resetState, camera]);
  return <></>;
}

function ControlledBox() {
  let xValueState = useRecoilValue(xValue);
  let yValueState = useRecoilValue(yValue);

  return (
    <mesh position={[xValueState, yValueState, 0.25]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function UncontrolledBox() {
  let [colorBool, setColorBool] = useState(true);
  const click = (e: any) => {
    setColorBool(!colorBool);
  };
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0.25]} onClick={click}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={colorBool ? "green" : "blue"} />
    </mesh>
  );
}

function GroundPlane() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="silver" transparent={true} opacity={0.3} />
    </mesh>
  );
}

function AppCanvas() {
  let click = (e: any) => {
    console.log("Click");
  };
  return (
    <div style={{ width: "50vw", height: "50vh" }}>
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 5] }}>
        <color attach="background" args={["black"]} />
        <OrbitControls />
        <CameraResetNode />

        <GroundPlane />

        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />

        <ControlledBox />
        <UncontrolledBox />
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
              <MovementControls />
            </Col>
          </Row>
        </Container>
      </div>
    </RecoilRoot>
  );
}

export default App;
