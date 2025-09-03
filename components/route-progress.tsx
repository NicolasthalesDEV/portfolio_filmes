"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function RouteProgress() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start progress when path changes
    setVisible(true)
    setProgress(10)
    // Simulate loading progress
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setProgress(80), 100)
    const finishRef = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setVisible(false), 150)
      setTimeout(() => setProgress(0), 300)
    }, 450)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      clearTimeout(finishRef)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="h-0.5 w-full bg-transparent">
            <motion.div
              className="h-full bg-primary shadow-lg"
              animate={{ width: `${progress}%` }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
