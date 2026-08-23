import { useEffect, useState } from "react";

/** Keeps an element mounted long enough to play its exit transition before unmounting. */
export const useAnimatedMount = (show: boolean, exitDuration = 180) => {
  const [rendered, setRendered] = useState(show);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setRendered(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = setTimeout(() => setRendered(false), exitDuration);
    return () => clearTimeout(timeout);
  }, [show, exitDuration]);

  return { rendered, visible };
};
