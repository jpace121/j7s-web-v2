import { useStore } from "./Store.js";

function makeState(colors, brightnesses) {
  let state_list = { data: [] };
  for (let inc = 0; inc < 6; inc++) {
    const state = { color: colors[inc], brightness: brightnesses[inc] };
    state_list["data"][inc] = state;
  }
  return state_list;
}

function makeChangeRequest(uid, colors, brightnesses) {
  if (uid === null) {
    // not connected -> can't do anything.
    return null;
  }
  const change_request = { uid: uid, data: makeState(colors, brightnesses) };
  return change_request;
}

function makeSingleChangeRequest(uid, index, color, brightness) {
  if (uid === null) {
    // not connected -> can't do anything.
    return null;
  }
  const data = { color: color, brightness: brightness };
  const change_request = { uid: uid, index: index, data: data };
  return change_request;
}

export async function sendDesiredState() {
  // Get from store.
  const desiredColors = useStore.getState().toSendColors;
  const desiredBrightness = useStore.getState().toSendBrightness;
  const uid = useStore.getState().uid;
  const index = useStore.getState().toSendIndex;

  // Put into json.
  const change_request = makeSingleChangeRequest(
    uid,
    index,
    desiredColors[index],
    desiredBrightness[index],
  );
  if (change_request === null) {
    // Can't do anything.
    console.log("Not sure about my uid, can't send a request.");
  }
  // Make fetch request.
  const url = `/api/single_light`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify(change_request),
    });
  } catch (error) {
    console.log(error);
  }
}
