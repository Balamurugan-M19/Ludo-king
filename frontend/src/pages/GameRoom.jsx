import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Board from '../components/Board';
import Dice from '../components/Dice';
import PlayerHud from '../components/PlayerHud';
import GameLog from '../components/GameLog';

const GameRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [stompClient, setStompClient] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('ludoUser'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws-ludo');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      
      // Subscribe to room updates
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        setGameState(payload);
        if (payload.message) {
          setMessages(prev => [...prev, payload.message]);
        }
      });

      // Announce join to synchronize game state immediately
      const joinAction = {
        type: 'JOIN_ROOM',
        roomCode: roomId,
        playerId: user?.id
      };
      // Add a slight delay to ensure the server is ready to process the action
      setTimeout(() => {
        if (client.connected) {
          client.send(`/app/game/${roomId}/action`, {}, JSON.stringify(joinAction));
        }
      }, 500);

      setStompClient(client);
    }, (error) => {
      console.error('STOMP Error:', error);
    });

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [roomId, user?.id, navigate]);

  useEffect(() => {
    const meStr = String(user?.id);
    const isMyTurnRightNow = String(gameState?.players?.[gameState.turnIndex]?.playerId) === meStr;
    
    if (gameState && isMyTurnRightNow && gameState.diceRolled) {
      let hasPlayableToken = false;
      const me = gameState.players.find(p => String(p.playerId) === meStr);
      if (me) {
        me.tokens.forEach(token => {
          if (!token.isHome) {
            if (token.position === -1) {
              if (gameState.diceValue === 6) hasPlayableToken = true;
            } else {
              hasPlayableToken = true;
            }
          }
        });
      }

      if (!hasPlayableToken) {
        const timer = setTimeout(() => {
          if (stompClient && stompClient.connected) {
            stompClient.send(`/app/game/${roomId}/action`, {}, JSON.stringify({
              type: 'PASS_TURN',
              roomCode: roomId,
              playerId: user?.id
            }));
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, stompClient, roomId, user?.id]);

  const handleRollDice = (value) => {
    if (stompClient && stompClient.connected) {
      const action = {
        type: 'ROLL_DICE',
        roomCode: roomId,
        playerId: user?.id
      };
      stompClient.send(`/app/game/${roomId}/action`, {}, JSON.stringify(action));
    }
  };

  const handleTokenClick = (pieceIndex) => {
    if (stompClient && stompClient.connected) {
      const action = {
        type: 'MOVE_PIECE',
        roomCode: roomId,
        playerId: user?.id,
        pieceIndex: pieceIndex
      };
      stompClient.send(`/app/game/${roomId}/action`, {}, JSON.stringify(action));
    }
  };

  const handleSendChat = (message) => {
    if (stompClient && stompClient.connected && message.trim()) {
      const action = {
        type: 'CHAT_MESSAGE',
        roomCode: roomId,
        playerId: user?.id,
        chatMessage: message
      };
      stompClient.send(`/app/game/${roomId}/action`, {}, JSON.stringify(action));
    }
  };

  // Get players by color for HUD placement
  const getPlayerByColor = (color) => gameState?.players?.find(p => p.color === color);
  
  const isMyTurn = String(gameState?.players?.[gameState.turnIndex]?.playerId) === String(user?.id);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      
      {/* Floating Room Info Header */}
      <div className="glass-card" style={{ 
        position: 'absolute', 
        top: '2rem', 
        left: '50%', 
        transform: 'translateX(-50%)',
        padding: '0.5rem 1.5rem', 
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderRadius: '30px'
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>ROOM</span>
        <span style={{ color: 'white', fontWeight: '800', letterSpacing: '2px', fontSize: '1.2rem' }}>{roomId}</span>
      </div>

      {/* Main Centered Board */}
      <div style={{ position: 'relative', zIndex: 10, transform: 'scale(1.1)' }}>
        <Board 
          gameState={gameState} 
          onTokenClick={handleTokenClick}
          currentPlayerId={user?.id}
        />
      </div>

      {/* 4 Player HUDs */}
      {gameState && gameState.players && gameState.players.length > 0 && (
        <>
          <PlayerHud 
            player={getPlayerByColor('RED')} 
            isTurn={gameState.players[gameState.turnIndex]?.color === 'RED'} 
            position="top-left" 
            currentUserId={user?.id} 
          />
          <PlayerHud 
            player={getPlayerByColor('GREEN')} 
            isTurn={gameState.players[gameState.turnIndex]?.color === 'GREEN'} 
            position="top-right" 
            currentUserId={user?.id} 
          />
          <PlayerHud 
            player={getPlayerByColor('YELLOW')} 
            isTurn={gameState.players[gameState.turnIndex]?.color === 'YELLOW'} 
            position="bottom-right" 
            currentUserId={user?.id} 
          />
          <PlayerHud 
            player={getPlayerByColor('BLUE')} 
            isTurn={gameState.players[gameState.turnIndex]?.color === 'BLUE'} 
            position="bottom-left" 
            currentUserId={user?.id} 
          />
        </>
      )}

      {/* Floating Action Log */}
      <GameLog messages={messages} onSendChat={handleSendChat} />

      {/* Floating Action Console (Dice) */}
      <div className="glass-card" style={{
        position: 'absolute',
        left: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        borderRadius: '20px',
        borderLeft: isMyTurn ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '1px' }}>
            {isMyTurn ? 'YOUR TURN' : 'OPPONENT'}
          </span>
          {gameState && gameState.players && gameState.players.length > 0 && (
            <span style={{ 
              fontWeight: '800', 
              fontSize: '1.2rem',
              color: `var(--ludo-${gameState.players[gameState.turnIndex]?.color?.toLowerCase()})`,
              textShadow: `0 0 10px var(--ludo-${gameState.players[gameState.turnIndex]?.color?.toLowerCase()}-glow)`
            }}>
              {gameState.players[gameState.turnIndex]?.color}
            </span>
          )}
        </div>
        
        <div style={{ 
          height: '1px', 
          width: '80%', 
          background: 'var(--glass-border)' 
        }}></div>

        <Dice 
          onRoll={handleRollDice} 
          value={gameState?.diceValue || 1} 
          disabled={!isMyTurn || gameState?.diceRolled} 
          isRolled={gameState?.diceRolled}
        />
      </div>

    </div>
  );
};

export default GameRoom;
