import React, { useState } from "react";
import { deleteObra } from "../../api";
import { Button, Form, Container, Modal, Collapse, Card, Dropdown } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import DatosObra from "./DatosObra";
import { useMediaQuery } from "react-responsive";

const ListaObras = ({ obras = [], onObraEliminada }) => {
  const [cambios, setCambios] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [mostrarDatosObra, setMostrarDatosObra] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const rolUsuario = localStorage.getItem("userRol");

  const getToken = useAuth();

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const handleEliminar = async (obraId) => {
    const usuarioToken = getToken();

    try {
      await deleteObra(obraId, usuarioToken);
      setCambios(true);
      setShowConfirmModal(false);
      if (onObraEliminada) {
        onObraEliminada(obraId);
      }
    } catch (error) {
      setError(error.response?.data?.error);
    }
  };

  const confirmarEliminar = (obra) => {
    setObraSeleccionada(obra);
    setShowConfirmModal(true);
  };

  const handleConfirmEliminar = () => {
    handleEliminar(obraSeleccionada.id);
  };

  const handleMostrarDatosObra = (obra) => {
    setObraSeleccionada(obra);
    setMostrarDatosObra(true);
  };

  const handleVolver = () => {
    setMostrarDatosObra(false);
    setObraSeleccionada(null);
  };

  const obrasFiltradas = obras.filter(
    (obra) => filtroTipo === "" || obra.activa === (filtroTipo === "1")
  );

  return (
    <Container className="card">
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="lista-obras-collapse"
        aria-expanded={open}
        className="mb-3 boton-personalizado"
      >
        Lista de Obras
      </Button>
      <Collapse in={open}>
        <div id="lista-obras-collapse">
          {mostrarDatosObra && obraSeleccionada ? (
            <div>
              <Button variant="secondary" onClick={handleVolver}>
                Volver
              </Button>
              <DatosObra obraId={obraSeleccionada.id} />
            </div>
          ) : (
            <div>
              {isSmallScreen ? (
                obrasFiltradas.map((obra, index) => (
                  <Card key={obra.id} className="mb-3">
                    <Card.Body>
                      <h5>{index + 1}. {obra.calle}</h5>
                      {/* <p><strong>Esquina:</strong> {obra.esquina}</p> */}
                      <p><strong>Estado:</strong> {obra.activa ? "Activa" : "No activa"}</p>
                      <div className="d-flex justify-content-start">
                        <Dropdown>
                          <Dropdown.Toggle
                            as={Button}
                            variant="link"
                            style={{
                              padding: 0,
                              margin: 0,
                              border: "none",
                              background: "none",
                              boxShadow: "none",
                            }}
                          >
                            <GearFill size={24} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleMostrarDatosObra(obra)}>
                              Datos
                            </Dropdown.Item>
                            {rolUsuario === "admin" && (
                              <Dropdown.Item onClick={() => confirmarEliminar(obra)}>
                                Eliminar
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        style={{ width: "150px", padding: "0.5rem" }}
                      >
                        <Form.Control
                          as="select"
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          style={{ width: "100%" }}
                        >
                          <option value="">Filtrar por estado</option>
                          <option value="1">Activas</option>
                          <option value="0">No activas</option>
                        </Form.Control>
                      </th>
                      <th scope="col">Calle</th>
                      {/* <th scope="col">Esquina</th> */}
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {obrasFiltradas.map((obra, index) => (
                      <React.Fragment key={obra.id}>
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{obra.calle}</td>
                          {/* <td>{obra.esquina}</td> */}
                          <td>
                          <Dropdown>
                          <Dropdown.Toggle
                            as={Button}
                            variant="link"
                            style={{
                              padding: 0,
                              margin: 0,
                              border: "none",
                              background: "none",
                              boxShadow: "none",
                            }}
                          >
                            <GearFill size={18} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleMostrarDatosObra(obra)}>
                              Datos
                            </Dropdown.Item>
                            {rolUsuario === "admin" && (
                              <Dropdown.Item onClick={() => confirmarEliminar(obra)}>
                                Eliminar
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
              <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {error && <p>{error}</p>}
                  ¿Estás seguro de que deseas eliminar la obra ubicada en{" "}
                  {obraSeleccionada?.calle}?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={handleConfirmEliminar}>
                    Eliminar
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </div>
      </Collapse>
    </Container>
  );
};

export default ListaObras;
