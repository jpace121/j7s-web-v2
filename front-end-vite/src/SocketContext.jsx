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
    const onMessage = (input) => {
      input = JSON.parse(input);
      console.log(input);

      // TODO: Modify the API so we don't have to do a dance here to figure
      // out message type.
      // If I have a UID, I'm the ack response.
      if (input.hasOwnProperty("uid")) {
        setUid(input["uid"]);
        const newColors = input.data.data; // lol
        for (let inc = 0; inc < newColors.length; inc++) {
          const brightness = newColors[inc].brightness;
          const color = newColors[inc].color;
          setToDisplayBrightness(inc, brightness);
          setToDisplayColor(inc, color);
        } // end for
      } // end if
      else {
        // I must be a normal state update.
        const newColors = input.data;
        for (let inc = 0; inc < newColors.length; inc++) {
          const brightness = newColors[inc].brightness;
          const color = newColors[inc].color;
          setToDisplayBrightness(inc, brightness);
          setToDisplayColor(inc, color);
        } // end for
      } //end else
    };

    // TODO: Use window.location
    socket.current = new WebSocket("ws://localhost:9000/api/lights/ws");

    // Connection opened
    socket.current.addEventListener("open", (event) => {
      console.log("Connected to ws.");
    });
    // Connection closed.
    socket.current.addEventListener("close", (event) => {
      console.log("Disconnected from ws.");
    });

    // Messages!
    socket.current.addEventListener("message", (event) => {
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
