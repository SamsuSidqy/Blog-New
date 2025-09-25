"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaLockOpen   } from "react-icons/fa";
import { motion } from 'framer-motion';
import { TbLoader } from "react-icons/tb";


const BtnSkelton = () => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="space-y-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {/* Image skeleton */}
        <div className="text-green-600 text-2xl flex justify-center items-center bg-gray-300 h-15 w-full rounded">
          <TbLoader className="animate-spin" />
        </div>
        
      </motion.div>
    </motion.div>
  );
};



export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [lock, setLock] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  const router = useRouter()

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      setLoading(false)
      router.push('/dashboard')
    } else {
      setLoading(false)
      const error = await res.text()
      alert(`Login failed: ${error}`)
    }
  }

  return (
    <div className="flex flex-col gap-15 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between lg:mx-10 lg:my-10 mx-5 my-8">
        <h2 className="text-xl text-black font-semibold">Abi Samsoe Apps</h2>
        <h2 className="text-blue-600 hover:underline cursor-pointer">Kembali</h2>
      </div>

      {/* Login Container */}
      <div className="flex text-black justify-center items-center">
        <form onSubmit={handleLogin}>
          <div
            className="w-[480px] p-6 bg-white flex flex-col gap-10 rounded-md relative overflow-hidden shadow-lg"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setCursorPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              })
            }}
          >
            {/* Motion blur that follows cursor */}
            <motion.div
              className="absolute bg-blue-400 rounded-full opacity-20 pointer-events-none blur-2xl"
              style={{
                width: 200,
                height: 200,
                x: cursorPos.x - 100,
                y: cursorPos.y - 100,
              }}
              animate={{
                x: cursorPos.x - 100,
                y: cursorPos.y - 100,
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
              }}
            />

            {/* Username Input */}
            <div className="w-full text-lg px-5 h-14 border-2 border-black rounded-md flex flex-row items-center gap-5 bg-white relative z-10">
              <FaUser className="text-2xl" />
              <input
                placeholder="Username"
                type="text"
                className="h-full w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="w-full text-lg px-5 h-14 border-2 border-black rounded-md flex flex-row items-center gap-5 bg-white relative z-10">
              {lock ? (
                <FaLockOpen
                  onClick={() => setLock(!lock)}
                  className="text-2xl cursor-pointer"
                />
              ) : (
                <FaLock
                  onClick={() => setLock(!lock)}
                  className="text-2xl cursor-pointer"
                />
              )}
              <input
                placeholder="Password"
                type={lock ? "text" : "password"}
                className="h-full w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            {loading ? <BtnSkelton /> : (<button
              type="submit"
              className="hover:bg-gray-300 hover:text-black duration-200 bg-black text-white h-14 rounded-md font-bold cursor-pointer relative z-10"
            >
              Log In
            </button>)}
          </div>
        </form>
      </div>
    </div>
  )
}

