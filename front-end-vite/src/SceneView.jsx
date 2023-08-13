import { useStore } from "./Store.js";
import { Canvas } from "@react-three/fiber";
import { Color } from "three";

function j7sColorToThree(j7sColor) {
  if (j7sColor === "off") {
    return new Color("black");
  }
  return new Color(j7sColor);
}

function IndicatorBox(props) {
  const displayColors = useStore((state) => state.toDisplayColors);
  const boxColor = j7sColorToThree(displayColors[props.boxNum]);
  return (
    <mesh rotation={[0, 0, 0]} position={[props.xPos, 0, 0.25]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={boxColor} />
    </mesh>
  );
}

export function AppCanvas() {
  return (
    <div style={{ width: "50vw", height: "50vh" }}>
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 5] }}>
        <color attach="background" args={["white"]} />

        <ambientLight intensity={1.0} />

        <IndicatorBox xPos={-2.5} boxNum={0} />
        <IndicatorBox xPos={-1.5} boxNum={1} />
        <IndicatorBox xPos={-0.5} boxNum={2} />
        <IndicatorBox xPos={0.5} boxNum={3} />
        <IndicatorBox xPos={1.5} boxNum={4} />
        <IndicatorBox xPos={2.5} boxNum={5} />
      </Canvas>
    </div>
  );
}
