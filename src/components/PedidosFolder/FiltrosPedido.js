import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Collapse, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";
import SelectEmpresaPorNombre from "../EmpresasFolder/SelectEmpresaPorNombre";
import SelectParticularPorNombre from "../ParticularesFolder/SelectParticularPorNombre";
import { TIPOS_HORARIO_PEDIDO, ESTADOS_PEDIDO } from "../../config/config";
import { getEmpresaId, getParticularId } from "../../api";
import useAuth from "../../hooks/useAuth";

const FiltrosPedido = ({ setFiltros, onCleanFiltros} ) => {
  const savedFiltros = JSON.parse(localStorage.getItem("filtrosPedido")) || {};
  const [fechaInicio, setFechaInicio] = useState(
    savedFiltros.fechaInicio || moment().startOf("day").add(1, "hours").format("YYYY-MM-DDTHH:mm")
  );
  const [fechaFin, setFechaFin] = useState(
    savedFiltros.fechaFin || moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [estado, setEstado] = useState(savedFiltros.estado || "");
  const [tipoHorario, setTipoHorario] = useState(savedFiltros.tipoHorario || "creacion");
  const [empresaId, setEmpresaId] = useState(savedFiltros.empresaId || null);
  const [obras, setObras] = useState([]);
  const [obraId, setObraId] = useState(savedFiltros.obraId || "");
  const [particularId, setParticularId] = useState(savedFiltros.particularId || null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [particularNombre, setParticularNombre] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const hasMounted = useRef(false);
  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );
  const [choferSeleccionado, setChoferSeleccionado] = useState(savedFiltros.choferId || "");
  const getToken = useAuth();

  useEffect(() => {
    // Al montar el componente, envía los filtros iniciales al componente padre
    const filtrosIniciales = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,  
      particularId,
      obraId: obraId === "" ? "" : Number(obraId),
      choferId: choferSeleccionado,
    };

    setFiltros(filtrosIniciales);
  }, []);

  const resetearFiltros = () => {
    setFechaInicio(moment().startOf("day").add(1, "hours").format("YYYY-MM-DDTHH:mm"));
    setFechaFin(moment().endOf("day").format("YYYY-MM-DDTHH:mm"));
    setEstado("");
    setTipoHorario("creacion");
    setEmpresaId(null);
    setEmpresaNombre("");
    setParticularId(null);
    setParticularNombre("");
    setObraId("");
    setFiltroTipo("");
    setChoferSeleccionado("");

    // Reseteando los filtros en el localStorage
    const filtrosPorDefecto = {
      tipoSugerencia: "general",
      filtroPago: "todos",
      filtroCliente: "todos",
      filtroMovimiento: "todos",
    };

    localStorage.setItem("filtrosPedido", JSON.stringify(filtrosPorDefecto));

    // Llama la función de reset que se pasa desde el componente padre
    onCleanFiltros(filtrosPorDefecto);
  };

  const handleFilterChange = (e) => {
    e.preventDefault();

    const filtrosAplicados = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
      particularId,
      obraId: obraId === "" ? "" : Number(obraId),
      choferId: choferSeleccionado,
    };

    setFiltros(filtrosAplicados);
  };

  const handleEmpresaSeleccionada = (id, nombre) => {
    setEmpresaId(id);
    setEmpresaNombre(nombre);
    setParticularId(null);
    setParticularNombre("");
  };

  const handleParticularSeleccionado = (id, nombre) => {
    setParticularId(id);
    setParticularNombre(nombre);
    setEmpresaId(null);
    setEmpresaNombre("");
  };

  const handleCancelarSeleccionEmpresa = () => {
    setEmpresaId(null);
    setEmpresaNombre("");
  };

  const handleCancelarSeleccionParticular = () => {
    setParticularId(null);
    setParticularNombre("");
  };

  useEffect(() => {
    const fetchObras = async () => {
      const usuarioToken = getToken();
      let response;
      if (empresaId) {
        response = await getEmpresaId(empresaId, usuarioToken);
      } else if (particularId) {
        response = await getParticularId(particularId, usuarioToken);
      }
      if (response && response.data && response.data.obras) {
        setObras(response.data.obras);
      }
    };

    if (hasMounted.current && (empresaId || particularId)) {
      fetchObras();
    } else {
      hasMounted.current = true;
    }
  }, [empresaId, particularId, getToken]);

  return (
    <Container>
      <Form onSubmit={handleFilterChange}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha de Inicio *</Form.Label>
              <Form.Control
                type="datetime-local"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="fechaFin">
              <Form.Label>Fecha de Fin *</Form.Label>
              <Form.Control
                type="datetime-local"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="tipoHorario">
              <Form.Label>Tipo Horario*</Form.Label>
              <Form.Control
                as="select"
                value={tipoHorario}
                onChange={(e) => setTipoHorario(e.target.value)}
                required
              >
                {TIPOS_HORARIO_PEDIDO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row className="mb-3">
        <Col>
          <Button
            onClick={() => setOpenFilters(!openFilters)}
            aria-controls="filtros-collapse"
            aria-expanded={openFilters}
            className="mt-3 mb-2 mb-md-0 me-md-2"
            style={{
              padding: "0.5rem 1rem",
            }}
          >
            {openFilters ? "Menos Filtros" : "Más Filtros"}
          </Button>
          <Button
            onClick={() => resetearFiltros()}
            aria-controls="filtros-collapse"
            aria-expanded={openFilters}
            className="mt-3 mb-2 mb-md-0 me-md-2"
            style={{
              padding: "0.5rem 1rem",
            }}
          >
            Limpiar campos
          </Button>
          {!openFilters && (
            <Button
              type="submit"
              onClick={handleFilterChange}
              className="mt-3 mb-2 mb-md-0 me-md-2"
              style={{
                padding: "0.5rem 1rem",
              }}
            >
              Buscar
            </Button>
          )}
        </Col>
      </Row>
      <Collapse in={openFilters}>
        <div id="filtros-collapse">
          <Form onSubmit={handleFilterChange}>
            <Row>
              <Col md={5}>
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {ESTADOS_PEDIDO.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="choferSeleccionado">
                  <Form.Label>Seleccionar Chofer</Form.Label>
                  <Form.Control
                    as="select"
                    value={choferSeleccionado}
                    onChange={(e) => setChoferSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccione un chofer</option>
                    {choferes.map((chofer) => (
                      <option key={chofer.id} value={chofer.id}>
                        {chofer.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={5}>
                {!empresaId && !particularId && (
                  <Form.Group controlId="filtroTipo">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control
                      as="select"
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                      <option value="">Seleccione tipo Cliente</option>
                      <option value="empresa">Empresa</option>
                      <option value="particular">Particular</option>
                    </Form.Control>
                  </Form.Group>
                )}
                {filtroTipo &&
                  filtroTipo !== "" &&
                  (filtroTipo === "empresa" ? (
                    empresaId ? (
                      <>
                        <Form.Text>
                          <strong>Cliente:</strong> {empresaNombre}{" "}
                          <a
                            href="#"
                            onClick={handleCancelarSeleccionEmpresa}
                            style={{
                              marginLeft: "10px",
                              fontSize: "0.875em",
                              color: "red",
                            }}
                          >
                            (Cancelar)
                          </a>
                        </Form.Text>
                      </>
                    ) : (
                      <SelectEmpresaPorNombre
                        onSeleccionar={handleEmpresaSeleccionada}
                      />
                    )
                  ) : (
                    filtroTipo === "particular" &&
                    (particularId ? (
                      <>
                        <Form.Text>
                          <strong>Cliente:</strong> {particularNombre}{" "}
                          <a
                            href="#"
                            onClick={handleCancelarSeleccionParticular}
                            style={{
                              marginLeft: "10px",
                              fontSize: "0.875em",
                              color: "red",
                            }}
                          >
                            (Cancelar)
                          </a>
                        </Form.Text>
                      </>
                    ) : (
                      <SelectParticularPorNombre
                        onSeleccionar={handleParticularSeleccionado}
                      />
                    ))
                  ))}
              </Col>

              <Col md={5}>
                <Form.Group controlId="formObra">
                  <Form.Label>Selecciona una obra</Form.Label>
                  <Form.Control
                    as="select"
                    value={obraId}
                    onChange={(e) => setObraId(e.target.value)}
                    disabled={obras.length === 0}
                  >
                    <option value="">Sin obra</option>
                    {obras.length === 0 ? (
                      <option>No hay obras disponibles</option>
                    ) : (
                      obras.map((obra) => (
                        <option key={obra.id} value={obra.id}>
                          {obra.calle} {obra.esquina} {obra.numeroPuerta}
                        </option>
                      ))
                    )}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="mt-3">
              Buscar
            </Button>
          </Form>
        </div>
      </Collapse>
    </Container>
  );
};

export default FiltrosPedido;
