import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Button, NavLink, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import "../assets/css/navbar.css";
import "../assets/css/CustomSidebar.css";

const Navigation = ({ userRole }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const cerrarSesion = () => {
    localStorage.clear();
  sessionStorage.clear();
  navigate('/login');
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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        // xl breakpoint
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        expand="xl"
        className="navbar-custom py-3"
      >
        <Container style={{ position: "relative" }}>
          <div className="d-flex align-items-center">
            <div className="breadcrumbs-container">
              <Breadcrumbs />
            </div>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={toggleSidebar}
              className="ms-auto d-xl-none custom-toggler"
            >
              <div className="sidenav-toggler-inner">
                <div className="sidenav-toggler-line"></div>
                <div className="sidenav-toggler-line"></div>
                <div className="sidenav-toggler-line"></div>
              </div>
            </Navbar.Toggle>
          </div>
        </Container>
      </Navbar>
      <aside
        className={`sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 ps ${
          !sidebarVisible ? "collapsed" : ""
        } ${sidebarVisible ? "show" : ""}`}
        id="sidenav-main"
      >
        <div className="sidenav-header">
          <i
            className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
            onClick={toggleSidebar}
          ></i>
          <Nav.Link as={Link} to="/" className="navbar-brand m-0">
            <h5 className="ms-1 font-weight-bold">VOLKETAS 10</h5>
          </Nav.Link>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="user-info-sidenav d-flex align-items-center justify-content-between px-3 mb-3">
          <h5 className="mb-0">{localStorage.getItem("userNombre")}</h5>
          <Button variant="secondary" onClick={cerrarSesion}>
            Cerrar Sesión
          </Button>
        </div>
        <div
          className="collapse navbar-collapse w-auto ps"
          id="sidenav-collapse-main"
          style={{ overflowY: "auto", height: "calc(100vh - 150px)" }}
        >
          <Nav className="navbar-nav">
          <div
              onMouseEnter={() => handleMouseEnter("pedidos")}
              onMouseLeave={handleMouseLeave}
              className="nav-item-container"
            >
              <Nav.Item className="nav-item">
                <div
                  onClick={() => toggleExpand("pedidos")}
                  className="nav-link cursor-pointer nav-item-title"
                >
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tag text-info text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Pedidos</span>
                </div>
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "pedidos" ? "show" : ""
                  }`}
                >
                  <Nav.Link as={Link} to="/" onClick={handleMouseLeave}>
                    Pedidos
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
                    <i className="ni ni-collection text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Clientes</span>
                </div>
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "clientes" ? "show" : ""
                  }`}
                >
                  <Nav.Link as={Link} to="/empresas" onClick={handleMouseLeave}>
                    Empresas
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/particulares"
                    onClick={handleMouseLeave}
                  >
                    Particulares
                  </Nav.Link>
                </div>
              </Nav.Item>
            </div>
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
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "empleados" ? "show" : ""
                  }`}
                >
                  <Nav.Link
                    as={Link}
                    to="/empleados"
                    onClick={handleMouseLeave}
                  >
                    Lista de empleados
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/empleados/jornales"
                    onClick={handleMouseLeave}
                  >
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
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "camiones" ? "show" : ""
                  }`}
                >
                  <Nav.Link as={Link} to="/camiones" onClick={handleMouseLeave}>
                    Lista de camiones
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/camiones/historial"
                    onClick={handleMouseLeave}
                  >
                    Historial Camiones
                  </Nav.Link>
                </div>
              </Nav.Item>
            </div>

            <div
              onMouseEnter={() => handleMouseEnter("listas")}
              onMouseLeave={handleMouseLeave}
              className="nav-item-container"
            >
              <Nav.Item className="nav-item">
                <div
                  onClick={() => toggleExpand("listas")}
                  className="nav-link cursor-pointer nav-item-title"
                >
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-align-left-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Consultas y Reportes</span>
                </div>
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "listas" ? "show" : ""
                  }`}
                >
                  <Nav.Link as={Link} to="/permisos" onClick={handleMouseLeave}>
                    Lista de permisos
                  </Nav.Link>
                  <Nav.Link as={Link} to="/facturas" onClick={handleMouseLeave}>
                    Facturas
                  </Nav.Link>
                  <Nav.Link as={Link} to="/imm" onClick={handleMouseLeave}>
                    Lista IMM
                  </Nav.Link>
                  <NavLink as={Link} to="/reporteChofer" onClick={handleMouseLeave}>
                    Reporte de chofer
                  </NavLink>
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
                    <i className="ni ni-basket text-success text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Volquetas</span>
                </div>
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "volquetas" ? "show" : ""
                  }`}
                >
                  <Nav.Link
                    as={Link}
                    to="/volquetas"
                    onClick={handleMouseLeave}
                  >
                    Lista de volquetas
                  </Nav.Link>
                </div>
              </Nav.Item>
            </div>

            <div
              onMouseEnter={() => handleMouseEnter("cajas")}
              onMouseLeave={handleMouseLeave}
              className="nav-item-container"
            >
              <Nav.Item className="nav-item">
                <div
                  onClick={() => toggleExpand("cajas")}
                  className="nav-link cursor-pointer nav-item-title"
                >
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-app text-info text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Cajas</span>
                </div>
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "cajas" ? "show" : ""
                  }`}
                >
                  <Nav.Link
                    as={Link}
                    to="/cajas"
                    onClick={handleMouseLeave}
                  >
                    Entradas y Salidas
                  </Nav.Link>
                </div>
              </Nav.Item>
            </div>

            <div
              onMouseEnter={() => handleMouseEnter("estadisticas")}
              onMouseLeave={handleMouseLeave}
              className="nav-item-container"
            >
              <Nav.Item className="nav-item">
                <div
                  onClick={() => toggleExpand("estadisticas")}
                  className="nav-link cursor-pointer nav-item-title"
                >
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-chart-bar-32 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms-1">Estadisticas</span>
                </div>
                <div
                  className={`nav-submenu ms-5 collapse ${
                    expanded === "estadisticas" ? "show" : ""
                  }`}
                >
                  <Nav.Link
                    as={Link}
                    to="/estadisticascliente"
                    onClick={handleMouseLeave}
                  >
                    Cliente
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/estadisticasdeudores"
                    onClick={handleMouseLeave}
                  >
                    Deudores
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/estadisticaspedidos"
                    onClick={handleMouseLeave}
                  >
                    Pedidos
                  </Nav.Link>
                </div>
              </Nav.Item>
            </div>

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
                      <i className="ni ni-single-02 text-success text-sm opacity-10"></i>
                    </div>
                    <span className="nav-link-text ms-1">Usuarios</span>
                  </div>
                  <div
                    className={`nav-submenu ms-5 collapse ${
                      expanded === "usuarios" ? "show" : ""
                    }`}
                  >
                    <Nav.Link
                      as={Link}
                      to="/usuarios/confirmar"
                      onClick={handleMouseLeave}
                    >
                      Confirmar usuarios
                    </Nav.Link>
                  </div>
                </Nav.Item>
              </div>
            )}
          </Nav>
        </div>
      </aside>
    </div>
  );
};

export default Navigation;
