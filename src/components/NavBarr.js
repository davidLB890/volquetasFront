import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import Breadcrumbs from './Breadcrumbs';

const CustomNavbar = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const nombreUsuario = localStorage.getItem('userNombre');
  // Eliminar comillas adicionales si las hay
  // const cleanedNombreUsuario = nombreUsuario.replace(/^"|"$/g, "");

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar py-3">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center w-100 justify-content-between">
            <div className="breadcrumbs-container">
              <Breadcrumbs />
            </div>
            <div className="d-flex align-items-center">
              <h5 className="text-white mb-0 me-3">{nombreUsuario}</h5>
              <Button variant="secondary" onClick={cerrarSesion}>
                Cerrar Sesión
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
