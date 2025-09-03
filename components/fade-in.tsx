"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
  className?: string
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  className = "",
}: FadeInProps) {
  const directionVariants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: 20, opacity: 0 },
    right: { x: -20, opacity: 0 },
  }

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
