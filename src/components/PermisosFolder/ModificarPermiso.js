import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { putPermiso } from "../../api"; // Asegúrate de tener esta función en api.js
import useAuth from "../../hooks/useAuth";

const ModificarPermiso = ({ permiso, onHide, onPermisoModificado }) => {
  const getToken = useAuth();
  const [updatedPermiso, setUpdatedPermiso] = useState({
    fechaCreacion: permiso.fechaCreacion,
    fechaVencimiento: permiso.fechaVencimiento,
    //id: permiso.id,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setUpdatedPermiso({
      fechaCreacion: permiso.fechaCreacion,
      fechaVencimiento: permiso.fechaVencimiento,
      //id: permiso.id,
    });
  }, [permiso]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPermiso({ ...updatedPermiso, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    try {
      const response = await putPermiso(permiso.id, updatedPermiso, usuarioToken);
      onPermisoModificado(response.data);
      setSuccess("Permiso modificado correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al modificar el permiso:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Error al modificar el permiso");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group controlId="formFechaCreacion">
        <Form.Label>Fecha de Creación</Form.Label>
        <Form.Control
          type="date"
          name="fechaCreacion"
          value={updatedPermiso.fechaCreacion}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="formFechaVencimiento">
        <Form.Label>Fecha de Vencimiento</Form.Label>
        <Form.Control
          type="date"
          name="fechaVencimiento"
          value={updatedPermiso.fechaVencimiento}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
{/*       <Form.Group controlId="formNumero">
        <Form.Label>Número</Form.Label>
        <Form.Control
          type="text"
          name="id"
          value={updatedPermiso.id}
          onChange={handleInputChange}
          required
        />
      </Form.Group> */}
      <Button variant="secondary" onClick={onHide}
      className="mt-3"
      style={{
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
      }}>
        Cancelar
      </Button>
      <Button variant="primary" type="submit"
      className="mt-3"
      style={{
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
      }}>
        Guardar Cambios
      </Button>
    </Form>
  );
};

export default ModificarPermiso;
