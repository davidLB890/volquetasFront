import React, { useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { postPermiso } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";

const AgregarPermiso = ({ empresaId, particularId, onHide, onPermisoAgregado }) => {
  const getToken = useAuth();
  const [permiso, setPermiso] = useState({
    fechaCreacion: "",
    fechaVencimiento: "",
    empresaId: empresaId || null,
    particularId: particularId || null,
    id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPermiso({ ...permiso, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    try {
      const response = await postPermiso(permiso, usuarioToken);
      onPermisoAgregado(response.data);
      setSuccess("Permiso agregado correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al agregar el permiso:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Error al agregar el permiso");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFechaCreacion">
          <Form.Label>Fecha de Creación</Form.Label>
          <Form.Control
            type="date"
            name="fechaCreacion"
            value={permiso.fechaCreacion}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formFechaVencimiento">
          <Form.Label>Fecha de Vencimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaVencimiento"
            value={permiso.fechaVencimiento}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formNumero">
          <Form.Label>Número</Form.Label>
          <Form.Control
            type="text"
            name="id"
            value={permiso.id}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="secondary" onClick={onHide} className="mr-2">
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Agregar Permiso
        </Button>
      </Form>
    </>
  );
};

export default AgregarPermiso;
