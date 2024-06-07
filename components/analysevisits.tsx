"use client";

import { Analytics } from "@vercel/analytics/react";

export const AnalyseVisits = () => {
  return (
    <Analytics
      beforeSend={(event) => {
        if (event.url.includes("/admin")) {
          return null;
        }
        return event;
      }}
    />
  );
};
