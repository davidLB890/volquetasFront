import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { crearCamion } from "../../api";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { fetchCamiones } from "../../features/camionesSlice";
import "../../assets/css/AgregarCamion.css"; // Importa el archivo CSS

const AgregarCamion = () => {
  const matricula = useRef(null);
  const modelo = useRef(null);
  const anio = useRef(null);
  const estado = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refs = [matricula, modelo, anio, estado];
  const boton = useHabilitarBoton(refs);

  const getToken = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const response = await crearCamion(
        {
          matricula: mat,
          modelo: mod,
          anio: an,
          estado: est,
        },
        usuarioToken
      );
      const datos = response.data;

      if (datos.error) {
        setError(datos.error);
        setSuccess("");
      } else {
        setSuccess("Camión creado correctamente");
        setError("");

        dispatch(fetchCamiones(usuarioToken));

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      setError(
        error.response?.data?.detalle[0] ||
          error.response?.data?.error ||
          "Error inesperado. Inténtelo más tarde."
      );
      setSuccess("");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">

      {/* Versión para pantallas pequeñas */}
      <div className="form-container mt-5">
        <h2>Registrar Camión</h2>
        <Form>
          <Form.Group controlId="formMatricula" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Matrícula"
              ref={matricula}
            />
          </Form.Group>

          <Form.Group controlId="formModelo" className="mb-2">
            <Form.Control type="text" placeholder="Modelo" ref={modelo} />
          </Form.Group>

          <Form.Group controlId="formAnio" className="mb-2">
            <Form.Control type="text" placeholder="Año" ref={anio} />
          </Form.Group>

          <Form.Group controlId="formEstado" className="mb-2">
            <Form.Control type="text" placeholder="Estado" ref={estado} />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="text-center mb-2">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="text-center mb-2">
              {success}
            </Alert>
          )}

          <div className="text-center">
            <Button
              type="button"
              id="crearCamion_btn"
              variant="primary"
              onClick={registrarCamion}
              disabled={!boton}
            >
              Registrar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AgregarCamion;

