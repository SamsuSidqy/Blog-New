import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ onClick, isOn }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '60px',
        height: '30px',
        borderRadius: '30px',
        backgroundColor: isOn ? '#4ade80' : '#d1d5db', // green-400 or gray-300
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <motion.div
        layout
        animate={{ x: isOn ? 30 : 0 }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          position: 'absolute',
          left: '4px', // initial left offset
        }}
      />
    </div>
  );
};

export default ToggleSwitch;
