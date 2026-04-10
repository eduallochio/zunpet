"use client";

import { useEffect } from "react";

export function TrackPageView() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    fetch("/api/track/pageview", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}

export function TrackableStoreLink({
  store,
  href,
  children,
  className,
  style,
  "aria-label": ariaLabel,
}: {
  store: "android" | "ios";
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}) {
  const handleClick = () => {
    fetch("/api/track/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store }),
    }).catch(() => {});
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
