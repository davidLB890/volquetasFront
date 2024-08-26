import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
import { postCaja } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const AgregarSalidaCaja = ({ fecha, monto, moneda, onSuccess, onHide }) => {
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [empleadoId, setEmpleadoId] = useState(null);
  const [error, setError] = useState("");
  const getToken = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const dropdownRef = useRef(null);

  const empleados = useSelector((state) => state.empleados.empleados);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = empleados.filter((empleado) =>
        empleado.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmpleados(filtered);
      setShowDropdown(true);
    } else {
      setFilteredEmpleados([]);
      setShowDropdown(false);
    }
  };

  const handleEmpleadoSelect = (empleado) => {
    setEmpleadoId(empleado.id);
    setSearchTerm(empleado.nombre);
    setShowDropdown(false);
  };

  const handleAgregarCaja = async () => {
    const usuarioToken = getToken();

    if(motivo === "vale" || motivo === "gasto" || motivo ==="extraccion"){
        monto = -monto;
    }

    const caja = {
      fecha,
      motivo,
      monto,
      moneda,
      descripcion,
      empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
      pedidoId: null, // Se deja en null como especificado
    };

    try {
      await postCaja(caja, usuarioToken);
      onSuccess(); // Maneja el éxito (recargar datos, cerrar modal, etc.)
    } catch (error) {
      setError(error.response.data.error);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <>
      <Form>
      <Form.Group controlId="motivo">
  <Form.Label>Motivo *</Form.Label>
  <Form.Control
    as="select"
    value={motivo}
    onChange={(e) => setMotivo(e.target.value)}
    required
    style={{
      backgroundColor:
        motivo === "vale" || motivo === "gasto" || motivo === "extraccion"
          ? "#f8d7da" // Rojo claro para el select
          : motivo === "ingreso pedido" ||
            motivo === "ingreso cochera" ||
            motivo === "ingreso"
          ? "#d4edda" // Verde claro para el select
          : "", // Fondo por defecto si no hay selección
    }}
  >
    <option value="">Seleccione motivo</option>
    <option value="vale">Vale</option>
    <option value="gasto">Gasto</option>
    <option value="ingreso pedido">Ingreso Pedido</option>
    <option value="ingreso cochera">Ingreso Cochera</option>
    <option value="extraccion">Extracción</option>
    <option value="ingreso">Ingreso</option>
  </Form.Control>
</Form.Group>

        <Form.Group controlId="descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="searchEmpleado" ref={dropdownRef}>
          <Form.Label>Buscar Empleado</Form.Label>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={() => setShowDropdown(true)}
          />
          {showDropdown && (
            <Dropdown.Menu show style={{ width: "100%" }}>
              {filteredEmpleados.length > 0 ? (
                filteredEmpleados.map((empleado) => (
                  <Dropdown.Item
                    key={empleado.id}
                    onClick={() => handleEmpleadoSelect(empleado)}
                  >
                    {empleado.nombre} ({empleado.rol})
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled>No se encontraron resultados</Dropdown.Item>
              )}
            </Dropdown.Menu>
          )}
        </Form.Group>
      </Form>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-end mt-4">
        <Button variant="secondary" onClick={onHide} className="me-2">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregarCaja}>
          Agregar Salida de Caja
        </Button>
      </div>
    </>
  );
};

export default AgregarSalidaCaja;
