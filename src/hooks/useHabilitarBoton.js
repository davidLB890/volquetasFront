// hooks/useHabilitarBoton.js
import { useState, useEffect } from "react";

const useHabilitarBoton = (refs) => {
  const [habilitado, setHabilitado] = useState(false);

  useEffect(() => {
    const checkRefs = () => {
      if (refs.every(ref => ref.current && ref.current.value.trim() !== "")) {
        setHabilitado(true);
      } else {
        setHabilitado(false);
      }
    };

    checkRefs(); // Initial check

    refs.forEach(ref => {
      const input = ref.current;
      if (input) {
        input.addEventListener("input", checkRefs);
      }
    });

    return () => {
      refs.forEach(ref => {
        const input = ref.current;
        if (input) {
          input.removeEventListener("input", checkRefs);
        }
      });
    };
  }, [refs]);

  return habilitado;
};

export default useHabilitarBoton;
