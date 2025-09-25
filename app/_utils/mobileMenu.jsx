'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className="text-2xl focus:outline-none hover:text-sky-500 transition"
        aria-label="Toggle Menu"
      >
        {isOpen ? <HiX /> : <HiOutlineMenu />}
      </button>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-screen h-screen bg-white z-50 flex flex-col items-center justify-center space-y-8 text-xl font-semibold"
          >
            <div onClick={closeMenu} className="text-black cursor-pointer hover:text-sky-400">Home</div>
            <div onClick={closeMenu} className="text-black cursor-pointer hover:text-sky-400">Contact</div>
            <div onClick={closeMenu} className="text-black cursor-pointer hover:text-sky-400">Else</div>
            <div onClick={closeMenu} className="mt-10 text-red-500 cursor-pointer">Close</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
