// https://codepen.io/manz/pen/oNmeEdb
// https://codepen.io/manz/pen/YzBxava

import { useState, useCallback } from "preact/hooks";
import { type TargetedEvent } from "preact/compat";
import "./slider_select.css";
import type { ComponentProps } from "preact";

export type Option = string;

export type Options = Option[];

type SliderSelectProps = ComponentProps<"div"> & {
  options: Options;
  inLine: boolean;
  initial: number;
  defaultName?: string;
};

export default function SliderSelect({
  options = [],
  inLine = false,
  defaultName = "",
  initial = 0,
  onInput,
  ...props
}: SliderSelectProps) {
  const [selected, setSelected] = useState<number>(initial);
  const onSetSelected = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      setSelected(Number(e.currentTarget.value));
      onInput(e);
    },
    []
  );
  return (
    <div {...props} className="flex items-center gap-1">
      <datalist id="options">
        {options.map((option, i) => (
          <option value={i} label={option} />
        ))}
      </datalist>
      <div className="flex gap-1">
        <input
          className={`bg-blue-500 px-1 rounded-full`}
          type="range"
          list="options"
          min="0"
          max={String(options.length - 1)}
          value={selected}
          style={{ width: `${options.length * 1.5}rem` }}
          onInput={onSetSelected}
        />
        <output>{`${defaultName ? `${defaultName} ` : ""}${
          options[selected]
        }`}</output>
      </div>
    </div>
  );
}
