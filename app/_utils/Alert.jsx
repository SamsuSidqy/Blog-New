// SweetAlert.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

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

const Alerts = ({ show, onClose, title, message, status }) => {
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
            <div className={`${status ? "text-green-600" : "text-red-600"} text-5xl flex justify-center items-center mb-5`} >
              {status ? <FaCheckCircle /> : <IoIosCloseCircle /> }
            </div>
            <h2>{title}</h2>
            <p className="font-semibold" >{message}</p>
            <button onClick={onClose} style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alerts;
