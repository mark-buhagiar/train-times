/**
 * useFocusKey hook
 * Returns a key that changes every time the screen gains focus.
 * Use this key on animated components to replay animations on tab switch.
 */

import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useFocusKey(): number {
  const [focusKey, setFocusKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusKey((prev) => prev + 1);
    }, [])
  );

  return focusKey;
}
