import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Users, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('ludoUser'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCreateRoom = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/rooms/create?userId=${user.id}`);
      navigate(`/room/${res.data.roomCode}`);
    } catch (err) {
      setError('Failed to create room');
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    
    try {
      const res = await axios.post(`http://localhost:8080/api/rooms/join?roomCode=${roomCode}&userId=${user.id}`);
      navigate(`/room/${res.data.roomCode}`);
    } catch (err) {
      setError(err.response?.data || 'Failed to join room');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ludoUser');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2>Welcome, {user.username}</h2>
        <button className="btn-primary" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Create Room Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Plus size={32} color="var(--accent-primary)" />
          </div>
          <h3 style={{ marginBottom: '1rem' }}>Create New Game</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Host a new game and invite your friends with a room code.</p>
          <button className="btn-primary" onClick={handleCreateRoom} style={{ width: '100%' }}>Create Room</button>
        </div>

        {/* Join Room Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Users size={32} color="var(--ludo-green)" />
          </div>
          <h3 style={{ marginBottom: '1rem' }}>Join Existing Game</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enter the 6-character room code to join a game.</p>
          
          <form onSubmit={handleJoinRoom} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter Room Code" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem', textTransform: 'uppercase' }}
            />
            {error && <div style={{ color: 'var(--ludo-red)', fontSize: '0.9rem' }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--ludo-green)' }}>Join Game</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
