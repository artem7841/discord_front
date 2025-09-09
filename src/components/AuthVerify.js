import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isAuthPage = ['/login', '/register', '/chat'].includes(location.pathname);
      
      // Если токена нет и это не страница входа/регистрации — редирект на /login
      if (!token && !isAuthPage) {
        navigate('/login');
      }
      
      // Если токен есть и это страница входа/регистрации — редирект на главную
      if (token && isAuthPage) {
        navigate('/chat');
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  return null;
};

export default AuthVerify;