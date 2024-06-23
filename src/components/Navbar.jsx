import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({userRole}) => {

    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.clear();
        navigate("/login");
    }

  return (
    <Navbar bg="light" expand="lg" className='fixed-top'>
      <Container>
        <Navbar.Brand as={Link} to="/">Volketas 10</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          {userRole === 'admin' && (
              <NavDropdown title="Usuarios" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/usuarios/confirmar">Confirmar usuarios</NavDropdown.Item>
              </NavDropdown>
            )}
            <NavDropdown title="Empleados" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/empleados">Empleados</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/empleados/jornales">Jornales</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Camiones" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/camiones">Camiones</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/camiones/historial">Historial camiones</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Volquetas" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">Ubicación</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/">Otras</NavDropdown.Item>
            </NavDropdown>
            {/* Agrega más NavDropdowns aquí según sea necesario */}
          </Nav>
          <input type="button" value="logout" onClick={cerrarSesion}/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
