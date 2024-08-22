import { useEffect } from 'react';
import { volquetasVencidas } from '../api'; // Asegúrate de que la ruta sea correcta
import useAuth from '../hooks/useAuth';

const useVolquetasAlert = () => {
  const getToken = useAuth();

  useEffect(() => {
    const checkVolquetasVencidas = async () => {
      const usuarioToken = getToken();
      try {
        const response = await volquetasVencidas(usuarioToken);
        const volquetas = response.data;

        if (volquetas.length > 0) {
          setTimeout(() => {
            alert("Hay pedidos que no han sido levantados en más de 48hs, revise 'volquetas en vía pública' (esquina inferior derecha) para más detalles");
            //alert("Hay volquetas que ya cumplieron las 48hs de uso, revise 'volquetas en vía pública' (esquina inferior derecha) para más detalles");
          }, 100); // Ejecutar alert después de un pequeño retraso para permitir la carga del componente
        }
      } catch (error) {
        console.error('Error al verificar volquetas vencidas:', error);
      }
    };

    checkVolquetasVencidas(); // Check immediately on component mount

    const intervalId = setInterval(checkVolquetasVencidas, 2 * 60 * 60 * 1000); // Repeat every 2 hours

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [getToken]);
};

export default useVolquetasAlert;
