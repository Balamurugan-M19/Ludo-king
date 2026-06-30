import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dice6 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      // Hardcoding localhost for dev, eventually use env variable
      const res = await axios.post(`http://localhost:8080${endpoint}`, {
        username,
        password
      });
      
      // Store user in local storage
      sessionStorage.setItem('ludoUser', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="glass-card" style={{ width: '400px', maxWidth: '90vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
        <Dice6 size={32} color="var(--accent-primary)" />
        <h2>Ludo King</h2>
      </div>
      
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h3>
      
      {error && <div style={{ color: 'var(--ludo-red)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
          <input 
            type="text" 
            className="input-field" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
          <input 
            type="password" 
            className="input-field" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <span 
          style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </div>
    </div>
  );
};

export default Login;
