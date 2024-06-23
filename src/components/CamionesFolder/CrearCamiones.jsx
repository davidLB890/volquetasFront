import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCamion } from '../../api';
import useAuth from '../../hooks/useAuth';
import useHabilitarBoton from '../../hooks/useHabilitarBoton';

const CrearCamiones = () => {
  const matricula = useRef(null);
  const modelo = useRef(null);
  const anio = useRef(null);
  const estado = useRef(null);
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState('');

  //controla el estado del botón crear
  const refs = [matricula, modelo, anio, estado];
  const boton = useHabilitarBoton(refs);

  const getToken = useAuth();
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const registrarCamion = async () => {
    const usuarioToken = getToken();
    const mat = matricula.current.value;
    const mod = modelo.current.value;
    const an = anio.current.value;
    const est = estado.current.value;

    try {
      const response = await crearCamion({ 
        matricula: mat, 
        modelo: mod, 
        anio: an, 
        estado: est 
      }, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error, "bla bla");
        setError(datos.error);
        setSuccess('');
      } else {
        setSuccess("Camión creado correctamente");
        setError('');

        // Establecer un temporizador para limpiar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      //console.error("Error al crear camión:", error.response?.data?.detalle[0] || error.response?.data?.error || error.message);
      setError(error.response?.data?.detalle[0] || error.response?.data?.error || "Error inesperado. Inténtelo más tarde.");
      setSuccess('');
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="card row justify-content-center mt-5">
        <div className="card-header">
          <h3>Registrar camión</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="input-group form-group">
              <input type="text" className="form-control" placeholder="Matrícula" ref={matricula} />
            </div>
            <div className="input-group form-group">
              <input type="text" className="form-control" placeholder="Modelo" ref={modelo} />
            </div>
            <div className="input-group form-group">
              <input type="text" className="form-control" placeholder="Año" ref={anio} />
            </div>
            <div className="input-group form-group">
              <input type="text" className="form-control" placeholder="Estado" ref={estado} />
            </div>
            {error && (
              <div className="alert alert-danger text-center">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success text-center">
                <span>{success}</span>
              </div>
            )}
            <div className="form-group text-center">
              <button type="button" id="crearCamion_btn" className="btn btn-primary styled-button" onClick={registrarCamion} disabled={!boton}>Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearCamiones;

