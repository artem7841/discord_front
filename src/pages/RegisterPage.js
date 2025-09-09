// src/pages/LoginPage.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // 1. Сначала регистрируем
    const signupResponse = await fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const signupResult = await signupResponse.text();
    
    if (!signupResponse.ok || signupResult !== "Success") {
      throw new Error(signupResult || 'Registration failed');
    }

    // 2. Если регистрация успешна, входим
    const loginResponse = await fetch('http://localhost:8070/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });

    if (!loginResponse.ok) {
      throw new Error('Login after registration failed');
    }

    const token = await loginResponse.text();
    
    if (!token.startsWith('eyJ')) {
      throw new Error('Invalid token format');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    login(token);
    navigate('/chat');

  } catch (err) {
    setError(err.message || 'Authentication failed');
    console.error('Auth error:', err);
  }
};

  return (
    <div class="auth-form">
      <h2>Регистрация</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Почта:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button class="add-habit-btn" type="submit">Регистрация</button>
        <button class="add-habit-btn" style={{ marginLeft: "10px" }} type="button" onClick={() => navigate('/login')}>Вход</button>
      </form>
    </div>
  );
};

export default RegisterPage;