import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-15"
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.4, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated dots pattern */}
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px', '0px 0px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Animated lines pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-60" />
    </div>
  )
}

