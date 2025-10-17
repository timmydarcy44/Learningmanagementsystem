'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface ClientShellProps {
  children: React.ReactNode
}

const ClientShell: React.FC<ClientShellProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Iris blob */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-iris-500 to-cyan-400 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Blush blob */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blush-500 to-lime-400 rounded-full opacity-15 blur-3xl"
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30" />
      </div>

      {/* Page content with transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ClientShell
