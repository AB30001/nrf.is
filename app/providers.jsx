"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    // The site is styled dark-first with explicit palette tokens rather than
    // `dark:` variants, so the theme class no longer drives the look. The
    // provider stays wired up so ThemeSwitch and any consumers keep working.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
