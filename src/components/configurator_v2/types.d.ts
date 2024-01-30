import type { JSXInternal } from "node_modules/preact/src/jsx";

export type InputItem = {
  key: string;
  label: string;
  eventHandler: (e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => void;
};

export type Inputs = InputItem[];
