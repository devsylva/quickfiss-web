"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // When pathname changes, if no hash is present, smooth scroll to the top
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          // Allow page DOM layout to settle before scrolling to target
          setTimeout(() => {
            const navOffset = 84;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }, 120);
          return;
        }
      }
      // Otherwise smooth scroll to the top of the newly loaded page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  useEffect(() => {
    // Global delegated smooth scrolling handler for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Same page anchor link (e.g., "#how-it-works" or "/#how-it-works" when on "/")
      const isHashOnCurrentPage =
        href.startsWith("#") ||
        (href.startsWith("/#") && (pathname === "/" || pathname === ""));

      if (isHashOnCurrentPage) {
        const id = href.replace(/^\/?#/, "");
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          const navOffset = 84;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          window.history.pushState(null, "", `#${id}`);
        }
      } else if (href === pathname || (href === "/" && pathname === "/")) {
        // If clicking a link to the current page (e.g. Privacy Policy while on /privacy), smooth scroll to top
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [pathname]);

  return null;
}
