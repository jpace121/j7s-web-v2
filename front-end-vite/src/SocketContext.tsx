import { useStore } from "./Store.js";
import React, { createContext, useEffect, useRef } from "react";

const SocketContext = createContext(null);

export function SocketWrapper(props) {
  let socket = useRef(null);
  const setToDisplayBrightness = useStore(
    (state) => state.setToDisplayBrightness,
  );
  const setToDisplayColor = useStore((state) => state.setToDisplayColor);
  const setUid = useStore((state) => state.setUid);

  useEffect(() => {
    const onMessage = (data) => {
      data = JSON.parse(data);
      console.log(data);
      if (data.hasOwnProperty("uid")) {
        setUid(data["uid"]);
      }
      if (data.hasOwnProperty("data")) {
        const newColors = data.data.data; // lol
        for (let inc = 0; inc < newColors.length; inc++) {
          const brightness = newColors[inc].brightness;
          const color = newColors[inc].color;
          setToDisplayBrightness(inc, brightness);
          setToDisplayColor(inc, color);
        }
      }
    };

    socket.current = new WebSocket("ws://localhost:9000/api/lights/ws");

    // Connection opened
    socket.current.addEventListener("open", (event: any) => {
      console.log("Connected to ws.");
    });
    // Connection closed.
    socket.current.addEventListener("close", (event: any) => {
      console.log("Disconnected from ws.");
    });

    // Messages!
    socket.current.addEventListener("message", (event: any) => {
      onMessage(event.data);
    });

    // On destruction disconnect.
    return () => {
      socket.current.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={null}>
      {props.children}
    </SocketContext.Provider>
  );
}
