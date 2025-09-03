"use client"

import "../styles/page-transitions.css"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"


interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const firstLoadRef = useRef(true);
  const [current, setCurrent] = useState({
    key: pathname,
    node: children,
    className: "pt-page-moveFromRight"
  });
  const [prev, setPrev] = useState<null | { key: string; node: ReactNode; className: string }>(null);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      setCurrent({ key: pathname, node: children, className: "pt-page-moveFromRight" });
      setPrev(null);
      return;
    }
    // Começa animação de saída do conteúdo atual
    setPrev({ ...current, className: "pt-page-moveToLeft" });
    setCurrent({ key: pathname, node: children, className: "pt-page-moveFromRight" });  
    // Remove o anterior após a animação
    const timeout = setTimeout(() => {
      setPrev(null);
    }, 600);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, children]);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {prev && (
        <div key={prev.key + "-prev"} className={prev.className} style={{ position: "absolute", inset: 0, width: "100%" }}>
          {prev.node}
        </div>
      )}
      <div key={current.key + "-current"} className={current.className} style={{ width: "100%" }}>
        {current.node}
      </div>
    </div>
  );
}
