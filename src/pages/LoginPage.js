// src/pages/LoginPage.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8070/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const token = await response.text();
      // Проверяем, что токен валидный (начинается с eyJ)
      if (!token.startsWith('eyJ')) {
        throw new Error('Invalid token format');
      }
      // Сохраняем токен
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        login(token);
        navigate('/chat'); // Перенаправляем на защищённую страницу
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div class="auth-form">
      <h2>Вход</h2>
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
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button class="add-habit-btn" type="submit">Вход</button>
        <button class="add-habit-btn" type="button" style={{ marginLeft: "10px" }} onClick={() => navigate('/register')}>Регистрация</button>
      </form>
    </div>
  );
};

export default LoginPage;