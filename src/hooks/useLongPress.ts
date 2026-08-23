"use client";

import { useRef } from "react";

export function useLongPress(onLongPress: () => void, delay = 500) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);

  const start = () => {
    triggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      if (navigator.vibrate) navigator.vibrate(10);
      onLongPress();
    }, delay);
  };

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const wasTriggered = () => {
    const fired = triggeredRef.current;
    triggeredRef.current = false;
    return fired;
  };

  return {
    handlers: {
      onTouchStart: start,
      onTouchEnd: clear,
      onTouchMove: clear,
      onTouchCancel: clear,
    },
    wasTriggered,
  };
}
