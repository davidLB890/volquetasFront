// hooks/useHabilitarBoton.js
import { useState, useEffect } from 'react';

const useHabilitarBoton = (refs) => {
  const [botonCrear, setBotonCrear] = useState(false);

  useEffect(() => {
    const habilitarBoton = () => {
      let val = 0;

      refs.forEach(ref => {
        if (ref.current.value !== "") {
          val++;
        }
      });

      if (val === refs.length) {
        setBotonCrear(true);
      } else {
        setBotonCrear(false);
      }
    };

    // Agregar evento de entrada a cada ref
    refs.forEach(ref => {
      if (ref.current) {
        ref.current.addEventListener('input', habilitarBoton);
      }
    });

    // Limpiar evento de entrada al desmontar el componente
    return () => {
      refs.forEach(ref => {
        if (ref.current) {
          ref.current.removeEventListener('input', habilitarBoton);
        }
      });
    };
  }, [refs]);

  return botonCrear;
};

export default useHabilitarBoton;

