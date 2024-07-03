import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FOUR_HOURS = 4 * 60 * 60 * 1000; // 4 horas en milisegundos
//const FOUR_HOURS = 10 * 1000; // 10 segundos en milisegundos

const isTokenExpired = () => {
  const savedTimestamp = localStorage.getItem('tokenTimestamp');
  if (!savedTimestamp) {
    return true; // No hay timestamp guardado, el token ha expirado
  }

  const now = new Date().getTime();
  if (now - savedTimestamp > FOUR_HOURS) {
    return true; // Han pasado más de 4 horas, el token ha expirado
  }

  return false;
};

const getToken = () => {
  if (isTokenExpired()) {
    localStorage.removeItem('apiToken');
    localStorage.removeItem('tokenTimestamp');
    return null;
  }
  return localStorage.getItem('apiToken');
};

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isTokenExpired()) {
        localStorage.removeItem('apiToken');
        localStorage.removeItem('tokenTimestamp');
        navigate('/login', { state: { sessionExpired: true } });
      }
    }, 60000); // Verifica cada minuto (60000 ms)

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, [navigate]);

  return getToken;
};

export default useAuth;
