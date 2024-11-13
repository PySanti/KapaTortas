
"use client";

import { useCallback, RefObject } from "react";

export function useSmoothScroll<T extends HTMLElement>(ref: RefObject<T>) {
  const scrollToSection = useCallback(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [ref]);

  return scrollToSection;
}