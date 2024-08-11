import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FOUR_HOURS = 4 * 60 * 60 * 1000; // 4 horas en milisegundos

const isTokenExpired = () => {
  const savedTimestamp = localStorage.getItem('tokenTimestamp');
  if (!savedTimestamp) {
    return true; // No hay timestamp guardado, el token ha expirado
  }

  const now = new Date().getTime();
  return now - savedTimestamp > FOUR_HOURS;
};

const getToken = () => {
  const token = localStorage.getItem('apiToken');
  if (!token || isTokenExpired()) {
    localStorage.removeItem('apiToken');
    localStorage.removeItem('tokenTimestamp');
    sessionStorage.clear();  // Limpia sessionStorage también
    return null;
  }
  return token;
};

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionValidity = () => {
      if (isTokenExpired()) {
        localStorage.removeItem('apiToken');
        localStorage.removeItem('tokenTimestamp');
        sessionStorage.clear();
        navigate('/login', { state: { sessionExpired: true } });
      }
    };

    const intervalId = setInterval(checkSessionValidity, 60000); // Verifica cada minuto

    return () => clearInterval(intervalId);
  }, [navigate]);

  return getToken;
};

export default useAuth;
