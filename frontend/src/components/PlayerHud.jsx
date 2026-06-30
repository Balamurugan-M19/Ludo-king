import React from 'react';

const PlayerHud = ({ player, isTurn, position, currentUserId }) => {
  if (!player) return null;

  const isMe = player.playerId === currentUserId;
  
  // Calculate how many tokens are in base vs home
  // position -1 is base, 100+ is home.
  const inBase = player.tokens.filter(t => t.position === -1).length;
  const inHome = player.tokens.filter(t => t.isHome).length;
  const inPlay = 4 - inBase - inHome;

  // Determine fixed positioning based on the position string
  const posStyles = {};
  if (position === 'top-left') { posStyles.top = '2rem'; posStyles.left = '2rem'; }
  if (position === 'top-right') { posStyles.top = '2rem'; posStyles.right = '2rem'; }
  if (position === 'bottom-left') { posStyles.bottom = '2rem'; posStyles.left = '2rem'; }
  if (position === 'bottom-right') { posStyles.bottom = '2rem'; posStyles.right = '2rem'; }

  return (
    <div className={`glass-card ${isTurn ? 'active-hud' : ''}`} style={{
      position: 'absolute',
      width: '240px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
      transition: 'all 0.3s ease',
      zIndex: 50,
      transform: isTurn ? 'scale(1.05)' : 'scale(1)',
      border: isTurn ? `2px solid var(--ludo-${player.color.toLowerCase()})` : '1px solid var(--glass-border)',
      boxShadow: isTurn ? `0 0 20px var(--ludo-${player.color.toLowerCase()}-glow)` : 'var(--glass-shadow)',
      ...posStyles
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          borderRadius: '50%',
          backgroundColor: `var(--ludo-${player.color.toLowerCase()})`,
          border: '2px solid white',
          boxShadow: `0 0 10px var(--ludo-${player.color.toLowerCase()}-glow)`,
          position: 'relative'
        }}>
          {isMe && <span style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'gold', color: 'black', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>YOU</span>}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {player.color} Player
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {isTurn ? 'Thinking...' : 'Waiting'}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px' }}>
         <div style={{ textAlign: 'center' }}>
           <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{inBase}</div>
           <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>BASE</div>
         </div>
         <div style={{ textAlign: 'center' }}>
           <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{inPlay}</div>
           <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ACTIVE</div>
         </div>
         <div style={{ textAlign: 'center' }}>
           <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'gold' }}>{inHome}</div>
           <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>HOME</div>
         </div>
      </div>
    </div>
  );
};

export default PlayerHud;
