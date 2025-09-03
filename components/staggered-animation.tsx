"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StaggeredAnimationProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export default function StaggeredAnimation({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggeredAnimationProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={item}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}
