import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null); //esto es para que si se desmonta el componente, se aborte la petición

  useEffect(() => {
    const abortController = new AbortController();
    setController(abortController); 
    setLoading(true);

    fetch(url, { signal: abortController.signal }) // Eliminé el segundo objeto vacío
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(error.message); // Usar error.message para evitar problemas al renderizar
        }
      })
      .finally(() => setLoading(false));

    return () => abortController.abort(); 
  }, []); // Incluí `url` como dependencia

/*   useEffect(() => {
    const abortController = new AbortController();
    setController(abortController); 
    setLoading(true);
    
    fetch(url, {signal: abortController.signal} ,{
        method:"GET", */
/*         headers: {
            "apikey": usuarioKey, //localStorage.getItem('apiKey'),
            "Content-Type": "application/json"
    
        } *//* })
       //este es un objeto que le pone como un rastreador
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(error);
        }})
      .finally(() => setLoading(false));

      return ()=> abortController.abort() //esto es para que si se desmonta el componente, se aborte la petición
  }, []); //tengo que hacerle el onchange para que se actualice
 */
   const handleAbortRequest = () => {
    if(controller){
        controller.abort();
        setError('Request cancelled');
    }
  };

  return {data, loading, error, handleAbortRequest }; //devolvemos como objeto porque es más fácil de desestructurar, evita fugas de memoria


}