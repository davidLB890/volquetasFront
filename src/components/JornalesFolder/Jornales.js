import React, { useEffect, useState, useRef } from 'react';
import { Container, Form, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ListaJornalesDatos from './ListaJornalesDatos';
import { useSelector } from 'react-redux';

const Jornales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const dropdownRef = useRef(null); // Referencia para el dropdown
  const navigate = useNavigate();
  const getToken = useAuth();

  const empleados = useSelector((state) => state.empleados.empleados);

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    setFechaInicio(firstDayOfMonth);
    setFechaFin(lastDayOfMonth);

  }, [getToken, navigate]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = empleados.filter(
        (empleado) => /* empleado.habilitado && */ empleado.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmpleados(filtered);
    } else {
      setFilteredEmpleados(empleados);
    }
    setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmpleadoSelect = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowDropdown(false);
    setSearchTerm(empleado.nombre);
  };

  const handleSearchClick = () => {
    setFilteredEmpleados(empleados);
    setShowDropdown(true);
  };

  return (
    <Container className='card'>
      <h1 className="mt-4 mb-4">Jornales</h1>
      <Form className="mb-4">
        <div className="row">
          <div className="col">
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group controlId="fechaFin">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>
        <Form.Group controlId="searchEmpleado" ref={dropdownRef}>
          <Form.Label>Buscar Empleado</Form.Label>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={handleSearchClick}
          />
          {showDropdown && (
            <Dropdown.Menu show>
              {filteredEmpleados.map((empleado) => (
                <Dropdown.Item
                  key={empleado.id}
                  onClick={() => handleEmpleadoSelect(empleado)}
                >
                  {empleado.nombre}{empleado.rol === "normal" && " (oficina)"}
                  {empleado.rol === "chofer" && " (chofer)"}
                  {empleado.rol === "admin" && " (admin)"}
                  {!empleado.habilitado && " deshabilitado"}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </Form.Group>
      </Form>

      {selectedEmpleado && (
        <div>
          <h2 className="mt-4 mb-3">{selectedEmpleado.nombre} 
            {selectedEmpleado.rol === "normal" && " (oficina)"}
            {selectedEmpleado.rol === "chofer" && " (chofer)"}
            {selectedEmpleado.rol === "admin" && " (administrador)"}
            {!selectedEmpleado.habilitado && " deshabilitado"}</h2>
          <ListaJornalesDatos
            empleadoId={selectedEmpleado.id}
            empleadoNombre={selectedEmpleado.nombre}
            empleadoRol={selectedEmpleado.rol}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </div>
      )}
    </Container>
  );
};

export default Jornales;