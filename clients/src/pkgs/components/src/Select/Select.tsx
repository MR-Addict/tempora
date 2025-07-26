import clsx from "clsx";
import { useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import style from "./Select.module.css";
import { useClickOutside } from "@pkgs/hooks";

export interface SelectOption<T> {
  /**
   * The label for the option.
   */
  label: React.ReactNode;
  /**
   * The value associated with the option.
   */
  value: T;
  /**
   * Whether the option is disabled.
   */
  disabled?: boolean;
  /**
   * Whether the option is active.
   */
  active?: boolean;
}

interface SelectProps<T> {
  /**
   * The label for the select input.
   */
  label: React.ReactNode;
  /**
   * The options to display in the select dropdown.
   */
  options: SelectOption<T>[];
  /**
   * Callback function to handle option selection.
   * @param value The selected value.
   */
  onChange?: (value: T) => void;
  /**
   * Additional CSS classes to apply to the select component.
   */
  className?: string;
  /**
   * Optional icon to display in the select button.
   *
   * @default true
   */
  arrowIcon?: boolean;
}

/**
 * A customizable select component that allows users to choose from a list of options.
 */
export function Select<T extends string | number>(props: SelectProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(() => setExpanded(false), selectRef);

  function handleClick(value: T) {
    props.onChange?.(value);
    setExpanded(false);
  }

  return (
    <div ref={selectRef} className={clsx(style.select, props.className)}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={clsx(style["label-btn"], { [style.expanded]: expanded })}
      >
        {props.label}
        {props.arrowIcon !== false && (
          <div className={style.arrowIcon}>
            <LuChevronDown />
          </div>
        )}
      </button>

      <ul className={clsx(style["select-menu"], { [style.expanded]: expanded })}>
        {props.options.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              disabled={option.disabled}
              className={clsx(style["option-btn"], { [style.active]: option.active })}
              onClick={() => handleClick(option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
