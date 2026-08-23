"use client";

import { useEffect, useState } from "react";

/** True below the `sm` breakpoint (640px) — for the rare cases layout needs to branch in JS, not just CSS. */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
};
