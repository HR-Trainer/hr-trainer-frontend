"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: any) {
  useEffect(() => {
    // Suppress the React 19 script tag warning caused by next-themes
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Encountered a script tag while rendering React component')
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
