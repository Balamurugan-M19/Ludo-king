import React, { useRef, useEffect, useState } from 'react';

const GameLog = ({ messages, onSendChat }) => {
  const logEndRef = useRef(null);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim() && onSendChat) {
      onSendChat(chatInput);
      setChatInput('');
    }
  };

  const handleEmoji = (emoji) => {
    if (onSendChat) onSendChat(emoji);
  };

  return (
    <div className="glass-card" style={{
      position: 'absolute',
      right: '2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '320px',
      height: '50vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      zIndex: 40
    }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Action Log</h3>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        paddingRight: '0.5rem',
        marginBottom: '1rem'
      }}>
        {messages.length === 0 && <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>Awaiting actions...</div>}
        
        {messages.map((m, i) => {
           let highlightColor = 'rgba(255,255,255,0.2)';
           if (m.includes('RED')) highlightColor = 'var(--ludo-red)';
           else if (m.includes('GREEN')) highlightColor = 'var(--ludo-green)';
           else if (m.includes('YELLOW')) highlightColor = 'var(--ludo-yellow)';
           else if (m.includes('BLUE')) highlightColor = 'var(--ludo-blue)';

           // Check if it's a chat message
           const isChat = m.includes('[CHAT]');
           const displayMsg = isChat ? m.replace('[CHAT] ', '') : m;

           return (
             <div key={i} style={{ 
               background: isChat ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0,0,0,0.4)', 
               padding: '0.6rem 0.75rem', 
               borderRadius: '8px',
               borderLeft: `3px solid ${highlightColor}`,
               fontSize: '0.85rem',
               lineHeight: '1.4',
               boxShadow: isChat ? '0 2px 5px rgba(0,0,0,0.2)' : 'none'
             }}>
               {displayMsg}
             </div>
           );
        })}
        <div ref={logEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', justifyContent: 'center' }}>
        {['😂', '😡', '😭', '🎯', '🔥', '🎲'].map(emoji => (
          <button 
            key={emoji} 
            onClick={() => handleEmoji(emoji)}
            style={{ 
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', 
              padding: '0.2rem 0.4rem', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            {emoji}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--glass-border)',
            color: 'white',
            padding: '0.5rem 0.8rem',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button type="submit" style={{
          background: 'var(--accent-primary)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default GameLog;
