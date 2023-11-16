// https://codepen.io/manz/pen/oNmeEdb
// https://codepen.io/manz/pen/YzBxava

import { useEffect, useState } from "preact/hooks";
import "./slider_select.css";
import type { ComponentProps } from "preact";

export type Option = {
  option: string;
};

export type Options = Option[];

type SliderSelectProps = ComponentProps<"div"> & {
  options: Options;
  inLine: boolean;
  defaultName?: string;
};

export default function SliderSelect({
  options = [],
  inLine = false,
  defaultName = "",
  ...props
}: SliderSelectProps) {
  const [selected, setSelected] = useState<number>(0);
  return (
    <div
      {...props}
      className={
        inLine ? "flex items-center gap-1" : "flex flex-col gap-2 items-end"
      }
    >
      <datalist className={inLine ? "" : "flex w-fit"} id="options">
        {options.map(({ option }, i) => (
          <option
            className={
              inLine ? "" : "text-xs text-gray-500 w-6 -rotate-[60deg]"
            }
            value={i}
            label={option}
          >
            {inLine ? "" : option}
          </option>
        ))}
      </datalist>
      <div className="flex gap-1">
        {!inLine && defaultName && <label>{defaultName}</label>}
        <input
          className={`bg-blue-500 px-1 rounded-full`}
          type="range"
          list="options"
          min="0"
          max={String(options.length - 1)}
          value={selected}
          style={{ width: `${options.length * 1.5}rem` }}
          onInput={(e) => setSelected(Number(e.currentTarget.value))}
        />
        {inLine ? (
          <output>{`${defaultName ? `${defaultName} ` : ""}${options[selected]
            ?.option}`}</output>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
