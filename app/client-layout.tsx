"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";
const PageTransition = dynamic(() => import("@/components/page-transition"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <PageTransition>
        {children}
      </PageTransition>
    </ThemeProvider>
  );
}
