import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');

      // Redirect to login
      navigate('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  return null;
}
