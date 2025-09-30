// SweetAlert.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiFolderWarningFill } from "react-icons/ri";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: {
    y: '-100vh',
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    y: '0',
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1 },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    scale: 0.5,
  },
};

const AlertsConfirm = ({ show, butonConfirm, buttonCancel}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <motion.div
            className="modal text-black"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '10px',
              textAlign: 'center',
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <div className="text-red-600 text-5xl flex justify-center items-center mb-5" >
              <RiFolderWarningFill />
            </div>
            <h2>File CDN Akan Di Hapus ?</h2>
            <div className="flex flex-row justify-center items-center gap-10 mt-5" >
              {butonConfirm}
              {buttonCancel}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertsConfirm;
