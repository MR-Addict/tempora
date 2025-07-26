import { z } from "zod";
import { useEffect, useState } from "react";

const prefix = "persistant-state";

function retrieveValue<T>(value: T | (() => T)) {
  try {
    return typeof value === "function" ? (value as () => T)() : value;
  } catch (err) {
    return null as T;
  }
}

interface PersistantStateOptions {
  /**
   * A validator function or Zod schema to validate the state value.
   */
  validator?: z.ZodType<any> | ((value: any) => boolean);

  /**
   * The storage type to use for persisting the state.
   *
   * Defaults to "local".
   */
  storage?: "local" | "session";
}

/**
 * A custom React hook that manages a state variable that persists in localStorage.
 *
 * @param key State key used for localStorage.
 * @param defaultValue Default value for the state.
 * @param options Optional configuration for the state.
 * @returns A tuple containing the current state and a function to update it.
 */
export function usePersistantState<T>(
  key: string,
  defaultValue: T | (() => T),
  options?: PersistantStateOptions
): [T, React.Dispatch<React.SetStateAction<T>>] {
  function getStorage() {
    return options?.storage === "session" ? sessionStorage : localStorage;
  }

  const [state, setState] = useState<T>(() => {
    // When in server-side rendering, we cannot access storage
    if (typeof window === "undefined") return retrieveValue(defaultValue);

    // Then get the value from storage
    const storage = getStorage();
    const storedValue = storage.getItem(`${prefix}-${key}`);
    if (!storedValue) return retrieveValue(defaultValue);

    // JSON.parse the stored value
    let parsedValue: T;
    try {
      parsedValue = JSON.parse(storedValue);
    } catch (err) {
      return retrieveValue(defaultValue);
    }

    // Return none-validated value if no validator is provided
    const validator = options?.validator;
    if (!validator) return parsedValue;

    let isValid = false;
    if (typeof validator === "function") {
      isValid = validator(parsedValue);
    } else if (validator instanceof z.ZodType) {
      isValid = validator.safeParse(parsedValue).success;
    }

    // If the value is valid, return it
    if (isValid) return parsedValue;
    // Otherwise, remove the item from storage and return the default value
    storage.removeItem(`${prefix}-${key}`);
    return retrieveValue(defaultValue);
  });

  useEffect(() => {
    const callback = () => getStorage().setItem(`${prefix}-${key}`, JSON.stringify(state));
    const timer = setTimeout(callback, 500);
    return () => clearTimeout(timer);
  }, [state, key]);

  return [state, setState];
}
