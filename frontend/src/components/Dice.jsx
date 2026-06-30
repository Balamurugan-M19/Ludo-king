import React, { useState, useEffect, useRef } from 'react';
import './Dice.css';

const Dice = ({ onRoll, value = 1, disabled = false, isRolled = false }) => {
  const [rolling, setRolling] = useState(false);
  const prevRolled = useRef(isRolled);

  // Trigger roll animation when server confirms a new roll (isRolled transitions from false to true)
  useEffect(() => {
    if (isRolled && !prevRolled.current) {
      setRolling(true);
      setTimeout(() => setRolling(false), 600);
    }
    prevRolled.current = isRolled;
  }, [isRolled, value]);

  const handleDiceClick = () => {
    if (rolling || disabled) return;
    if (onRoll) onRoll();
  };

  return (
    <div className="dice-container" onClick={handleDiceClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <div className={`dice ${rolling ? 'rolling' : ''}`} data-value={value || 1}>
        {/* Dice faces */}
        <div className="face front">
          <span className="dot center"></span>
        </div>
        <div className="face back">
          <span className="dot top-left"></span>
          <span className="dot top-right"></span>
          <span className="dot bottom-left"></span>
          <span className="dot bottom-right"></span>
          <span className="dot center-left"></span>
          <span className="dot center-right"></span>
        </div>
        <div className="face right">
          <span className="dot top-right"></span>
          <span className="dot center"></span>
          <span className="dot bottom-left"></span>
        </div>
        <div className="face left">
          <span className="dot top-left"></span>
          <span className="dot top-right"></span>
          <span className="dot bottom-left"></span>
          <span className="dot bottom-right"></span>
        </div>
        <div className="face top">
          <span className="dot top-right"></span>
          <span className="dot bottom-left"></span>
        </div>
        <div className="face bottom">
          <span className="dot top-left"></span>
          <span className="dot top-right"></span>
          <span className="dot bottom-left"></span>
          <span className="dot bottom-right"></span>
          <span className="dot center"></span>
        </div>
      </div>
    </div>
  );
};

export default Dice;
