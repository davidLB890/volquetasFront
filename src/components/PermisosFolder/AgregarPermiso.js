import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AlertMessage from "../AlertMessage";
import { postPermiso } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { createPermisoParticularSuccess } from "../../features/particularSlice";
import { createPermisoEmpresaSuccess } from "../../features/empresaSlice";

const AgregarPermiso = ({ show, onHide, empresaId, particularId }) => {
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [numeroPermiso, setNumeroPermiso] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();
  const dispatch = useDispatch();

  const handleAgregarPermiso = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    if (!fechaCreacion || !fechaVencimiento || !numeroPermiso) {
      setError("Todos los campos son obligatorios");
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (numeroPermiso.length < 3) {
      setError("El número de permiso debe tener al menos 3 caracteres");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const requestBody = {
        fechaCreacion,
        fechaVencimiento,
        id: numeroPermiso,
        ...(empresaId ? { empresaId } : { particularId }),
      };
      console.log("requestBody", requestBody);
      const response = await postPermiso(requestBody, usuarioToken);
      console.log("response", response);

      setSuccess("Permiso agregado correctamente");
      setFechaCreacion("");
      setFechaVencimiento("");
      setNumeroPermiso("");
      setTimeout(() => setSuccess(""), 7000);
      if(empresaId) {
        dispatch(createPermisoEmpresaSuccess(response.data));
      } else {
        dispatch(createPermisoParticularSuccess(response.data));
      }
    } catch (error) {
      console.error("Error al agregar el permiso:", error); // Log detallado del error
      setError(error.response?.data?.error || "Error al agregar el permiso");
      setTimeout(() => setError(""), 7000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Permiso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAgregarPermiso}>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
          <Form.Group controlId="fechaCreacion">
            <Form.Label>Fecha de Creación</Form.Label>
            <Form.Control
              type="date"
              value={fechaCreacion}
              onChange={(e) => setFechaCreacion(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="fechaVencimiento">
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="numeroPermiso">
            <Form.Label>Número de Permiso</Form.Label>
            <Form.Control
              type="text"
              value={numeroPermiso}
              onChange={(e) => setNumeroPermiso(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="secondary" 
          className="mt-3"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
            onClick={onHide}>
            Cerrar
          </Button>
          <Button className="mt-3" variant="primary" type="submit"
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
          }}>
            Agregar Permiso
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarPermiso;
