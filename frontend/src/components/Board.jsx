import React from 'react';
import { MAIN_PATH, SAFE_SQUARES, HOME_STRETCH, BASE_POSITIONS, getCoordinates } from '../utils/BoardCoordinates';

const Board = ({ gameState, onTokenClick, currentPlayerId }) => {
  const isMyTurn = gameState?.players?.[gameState.turnIndex]?.playerId === currentPlayerId;
  const turnColor = gameState?.players?.[gameState.turnIndex]?.color;

  // Render the base zones
  const renderBase = (color, rowStart, colStart) => (
    <div style={{
      gridArea: `${rowStart} / ${colStart} / ${rowStart + 6} / ${colStart + 6}`,
      backgroundColor: `var(--ludo-${color.toLowerCase()})`,
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%',
        backgroundColor: 'var(--bg-secondary)', borderRadius: '10%'
      }}></div>
    </div>
  );

  return (
    <div style={{
      width: '500px',
      height: '500px',
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      border: '4px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)',
      display: 'grid',
      gridTemplateColumns: 'repeat(15, 1fr)',
      gridTemplateRows: 'repeat(15, 1fr)',
      position: 'relative',
      borderRadius: '8px',
      animation: 'boardFloat 6s ease-in-out infinite'
    }}>
      {/* 4 Bases */}
      {renderBase('RED', 1, 1)}
      {renderBase('GREEN', 1, 10)}
      {renderBase('YELLOW', 10, 10)}
      {renderBase('BLUE', 10, 1)}

      {/* Center Home Polygon */}
      <div style={{
        gridArea: '7 / 7 / 10 / 10',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
      }}></div>

      {/* Render Main Path Cells */}
      {MAIN_PATH.map((cell, idx) => {
        const isSafe = SAFE_SQUARES.includes(idx);
        let colorIndicator = '';
        if (idx === 0) colorIndicator = 'var(--ludo-red)';
        if (idx === 13) colorIndicator = 'var(--ludo-green)';
        if (idx === 26) colorIndicator = 'var(--ludo-yellow)';
        if (idx === 39) colorIndicator = 'var(--ludo-blue)';

        return (
          <div key={`path-${idx}`} style={{
            gridRow: cell.r + 1, // CSS grid is 1-indexed
            gridColumn: cell.c + 1,
            border: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: isSafe ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)'
          }}>
            {colorIndicator && (
               <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: colorIndicator, opacity: 0.4 }} />
            )}
            {isSafe && <span style={{ fontSize: '14px', animation: 'safeStarGlow 2s infinite' }}>★</span>}
          </div>
        );
      })}

      {/* Render Home Stretches */}
      {Object.keys(HOME_STRETCH).map(color => (
        HOME_STRETCH[color].map((cell, idx) => (
          <div key={`home-${color}-${idx}`} style={{
            gridRow: cell.r + 1,
            gridColumn: cell.c + 1,
            backgroundColor: `var(--ludo-${color.toLowerCase()})`,
            opacity: idx === 5 ? 0.8 : 0.4,
            border: '1px solid rgba(255,255,255,0.1)'
          }}></div>
        ))
      ))}

      {/* Render Tokens over the grid */}
      {gameState?.players?.map(player => (
        player.tokens.map((token, index) => {
          const coords = getCoordinates(player.color, token.position, index);
          if (!coords) return null;
          
          let isPlayable = false;
          if (isMyTurn && player.playerId === currentPlayerId && gameState.diceRolled && !token.isHome) {
            if (token.position === -1) {
               // Token in base can only be played if dice is 6
               if (gameState.diceValue === 6) isPlayable = true;
            } else {
               // Token on board is playable
               isPlayable = true;
            }
          }
          
          return (
            <div 
              key={`token-${player.color}-${index}`}
              onClick={() => isPlayable ? onTokenClick(index) : null}
              style={{
                gridRow: coords.r + 1,
                gridColumn: coords.c + 1,
                width: '70%',
                height: '70%',
                margin: '15%',
                backgroundColor: `var(--ludo-${player.color.toLowerCase()})`,
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 60%)',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.8)',
                color: `var(--ludo-${player.color.toLowerCase()})`, // Used as currentColor for the glow
                boxShadow: isPlayable ? 'none' : '0 4px 10px rgba(0,0,0,0.8), inset 0 -3px 5px rgba(0,0,0,0.5)',
                cursor: isPlayable ? 'pointer' : 'default',
                transform: isPlayable ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s ease, left 0.5s ease, top 0.5s ease',
                animation: isPlayable ? 'playablePulse 1.5s infinite' : 'none',
                zIndex: isPlayable ? 20 : 10
              }}
            />
          );
        })
      ))}
    </div>
  );
};

export default Board;
