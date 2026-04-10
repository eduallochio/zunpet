"use client";

import dynamic from "next/dynamic";

export const ScrollStackWrapper = dynamic(
  () => import("@/components/landing/ScrollStack"),
  { ssr: false }
);

export const ScrollStackItemWrapper = dynamic(
  () => import("@/components/landing/ScrollStack").then((m) => ({ default: m.ScrollStackItem })),
  { ssr: false }
);
