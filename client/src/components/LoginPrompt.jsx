import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, UserPlus, LogIn } from 'lucide-react'

const LoginPrompt = ({ action = "add tasks" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
    >
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
        <Lock className="w-10 h-10 text-purple-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">
        Authentication Required
      </h3>
      
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        You need to be signed in to {action}. Please log in or create an account to continue.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </motion.button>
        </Link>
        
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </motion.button>
        </Link>
      </div>
      
      <p className="text-gray-500 text-sm mt-6">
        Don't worry, it only takes a minute to get started!
      </p>
    </motion.div>
  )
}

export default LoginPrompt
