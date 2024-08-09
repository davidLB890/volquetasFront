/* import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import Breadcrumbs from './Breadcrumbs';
import '../assets/css/navbar.css';

const CustomNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const nombreUsuario = localStorage.getItem('userNombre');

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom py-3">
      <Container style={{ position: 'relative' }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleSidebar} />
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex align-items-center">
          <div className="breadcrumbs-container">
            <Breadcrumbs />
          </div>
          <div className="user-info d-flex align-items-center ms-auto">
            <h5 className="text-white mb-0 me-3">{nombreUsuario}</h5>
            <Button variant="secondary" onClick={cerrarSesion}>
              Cerrar Sesión
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar; */
  /* import '../assets/css/navbar.css'; // Importa el archivo CSS */