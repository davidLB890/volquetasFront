import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import '../assets/css/CustomSidebar.css';

const CustomSidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState("");

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleExpand = (section) => {
    setExpanded((prevState) => (prevState === section ? "" : section));
  };

  const handleMouseEnter = (section) => {
    setExpanded(section);
  };

  const handleMouseLeave = () => {
    setExpanded("");
  };

  return (
    <aside
      className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 ps"
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        ></i>
        <Nav.Link as={Link} to="/" className="navbar-brand m-0">
          <h5 className="ms-1 font-weight-bold">VOLKETAS 10</h5>
        </Nav.Link>
      </div>
      <hr className="horizontal dark mt-0" />
      <div
        className="collapse navbar-collapse w-auto ps"
        id="sidenav-collapse-main"
        style={{ overflowY: "auto", height: "calc(100vh - 150px)" }}
      >
        <Nav className="navbar-nav">
          {userRole === "admin" && (
            <div
              onMouseEnter={() => handleMouseEnter("usuarios")}
              onMouseLeave={handleMouseLeave}
              className="nav-item-container"
            >
              <Nav.Item className="nav-item">
                <div
                  onClick={() => toggleExpand("usuarios")}
                  className="nav-link cursor-pointer nav-item-title"
                >
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-credit-card text-success text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Usuarios</span>
                </div>
                <div className={`nav-submenu ms-5 collapse ${expanded === "usuarios" ? "show" : ""}`}>
                  <Nav.Link as={Link} to="/usuarios/confirmar" onClick={handleMouseLeave}>
                    Confirmar usuarios
                  </Nav.Link>
                </div>
              </Nav.Item>
            </div>
          )}

          <div
            onMouseEnter={() => handleMouseEnter("empleados")}
            onMouseLeave={handleMouseLeave}
            className="nav-item-container"
          >
            <Nav.Item className="nav-item">
              <div
                onClick={() => toggleExpand("empleados")}
                className="nav-link cursor-pointer nav-item-title"
              >
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-credit-card text-success text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">Empleados</span>
              </div>
              <div className={`nav-submenu ms-5 collapse ${expanded === "empleados" ? "show" : ""}`}>
                <Nav.Link as={Link} to="/empleados" onClick={handleMouseLeave}>
                  Empleados
                </Nav.Link>
                <Nav.Link as={Link} to="/empleados/jornales" onClick={handleMouseLeave}>
                  Jornales
                </Nav.Link>
              </div>
            </Nav.Item>
          </div>

          <div
            onMouseEnter={() => handleMouseEnter("camiones")}
            onMouseLeave={handleMouseLeave}
            className="nav-item-container"
          >
            <Nav.Item className="nav-item">
              <div
                onClick={() => toggleExpand("camiones")}
                className="nav-link cursor-pointer nav-item-title"
              >
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-delivery-fast text-info text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">Camiones</span>
              </div>
              <div className={`nav-submenu ms-5 collapse ${expanded === "camiones" ? "show" : ""}`}>
                <Nav.Link as={Link} to="/camiones" onClick={handleMouseLeave}>
                  Camiones
                </Nav.Link>
                <Nav.Link as={Link} to="/camiones/historial" onClick={handleMouseLeave}>
                  Historial Camiones
                </Nav.Link>
              </div>
            </Nav.Item>
          </div>

          <div
            onMouseEnter={() => handleMouseEnter("volquetas")}
            onMouseLeave={handleMouseLeave}
            className="nav-item-container"
          >
            <Nav.Item className="nav-item">
              <div
                onClick={() => toggleExpand("volquetas")}
                className="nav-link cursor-pointer nav-item-title"
              >
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-archive-2 text-warning text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">Volquetas</span>
              </div>
              <div className={`nav-submenu ms-5 collapse ${expanded === "volquetas" ? "show" : ""}`}>
                <Nav.Link as={Link} to="/" onClick={handleMouseLeave}>
                  Ubicación
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={handleMouseLeave}>
                  Otras
                </Nav.Link>
              </div>
            </Nav.Item>
          </div>

          <div
            onMouseEnter={() => handleMouseEnter("clientes")}
            onMouseLeave={handleMouseLeave}
            className="nav-item-container"
          >
            <Nav.Item className="nav-item">
              <div
                onClick={() => toggleExpand("clientes")}
                className="nav-link cursor-pointer nav-item-title"
              >
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-single-02 text-primary text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">Clientes</span>
              </div>
              <div className={`nav-submenu ms-5 collapse ${expanded === "clientes" ? "show" : ""}`}>
                <Nav.Link as={Link} to="/clientes" onClick={handleMouseLeave}>
                  Clientes
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={handleMouseLeave}>
                  Otras
                </Nav.Link>
              </div>
            </Nav.Item>
          </div>

          <div
            onMouseEnter={() => handleMouseEnter("obras")}
            onMouseLeave={handleMouseLeave}
            className="nav-item-container"
          >
            <Nav.Item className="nav-item">
              <div
                onClick={() => toggleExpand("obras")}
                className="nav-link cursor-pointer nav-item-title"
              >
                <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="ni ni-single-02 text-primary text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text ms-1">Obras</span>
              </div>
              <div className={`nav-submenu ms-5 collapse ${expanded === "obras" ? "show" : ""}`}>
                <Nav.Link as={Link} to="/obras" onClick={handleMouseLeave}>
                  Obras
                </Nav.Link>
              </div>
            </Nav.Item>
          </div>
        </Nav>
      </div>
    </aside>
  );
};

export default CustomSidebar;





{
  /* <Navbar bg="light" expand="lg" className='fixed-top'>
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
					<NavDropdown title="Clientes" id="basic-nav-dropdown">
						<NavDropdown.Item as={Link} to="/clientes">Clientes</NavDropdown.Item>
						<NavDropdown.Item as={Link} to="/">Otras</NavDropdown.Item>
					</NavDropdown>
					{/* Agrega más NavDropdowns aquí según sea necesario 
				</Nav>
				<input type="button" value="Salir" onClick={cerrarSesion}/>
			</Navbar.Collapse>
		</Container>
	</Navbar> */
}
