import { create } from "zustand";

export const useStore = create((set, get) => ({
  toDisplayColors: ["green", "green", "green", "green", "green", "green"],
  toDisplayBrightness: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  toSendColors: ["green", "green", "green", "green", "green", "green"],
  toSendBrightness: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  uid: null,

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
  setUid: (new_uid) => {
    set((state) => ({ uid: new_uid }));
  },
}));
