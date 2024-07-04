import React, { useEffect, useState } from "react";
import { deleteObra, getObras } from "../../api";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ListaObras = () => {
  const [obras, setObras] = useState([]);
  const [cambios, setCambios] = useState(true);
  const [filtroCalle, setFiltroCalle] = useState("");
  const [filtroEsquina, setFiltroEsquina] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  const rolUsuario = localStorage.getItem("userRol");

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchObras = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate("/login");
      } else {
        try {
          const response = await getObras(usuarioToken);
          setObras(response.data);
          setCambios(false);
        } catch (error) {
          console.error(
            "Error al obtener obras:",
            error.response?.data?.error || error.message
          );
          if (error.response?.status === 401) {
            navigate("/login");
          }
        }
      }
    };

    if (cambios) {
      fetchObras();
    }
  }, [cambios, getToken, navigate]);

  const handleEliminar = async (obraId) => {
    const usuarioToken = getToken();

    try {
      await deleteObra(obraId, usuarioToken);
      setCambios(true);
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data?.error || error.message
      );
    }
  };

  const confirmarEliminar = (obra) => {
    setObraSeleccionada(obra);
    setShowConfirmModal(true);
  };

  const handleConfirmEliminar = () => {
    handleEliminar(obraSeleccionada.id);
    setShowConfirmModal(false);
  };

  const handleFiltrarCalle = (e) => {
    setFiltroCalle(e.target.value);
  };

  const handleFiltrarEsquina = (e) => {
    setFiltroEsquina(e.target.value);
  };

  const obrasFiltradas = obras.filter((obra) => {
    const calleMatches = obra.calle?.toLowerCase().startsWith(filtroCalle.toLowerCase());
    const esquinaMatches = obra.esquina?.toLowerCase().startsWith(filtroEsquina.toLowerCase());
    return (
      (filtroCalle === "" || calleMatches) &&
      (filtroEsquina === "" || esquinaMatches)
    );
  });

  return (
    <div className="card">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Calle</th>
            <th scope="col">Esquina</th>
            <th scope="col">Acciones</th>
          </tr>
          <tr>
            <th></th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por Calle"
                value={filtroCalle}
                onChange={handleFiltrarCalle}
              />
            </th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por Esquina"
                value={filtroEsquina}
                onChange={handleFiltrarEsquina}
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {obrasFiltradas.map((obra, index) => (
            <React.Fragment key={obra.id}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{obra.calle}</td>
                <td>{obra.esquina}</td>
                <td>
                  {rolUsuario === "admin" && (
                    <Button
                      variant="danger"
                      style={{
                        padding: "0.5rem 1rem",
                        marginRight: "0.5rem",
                      }}
                      onClick={() => confirmarEliminar(obra)}
                    >
                      Eliminar
                    </Button>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la obra ubicada en {obraSeleccionada?.calle}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaObras;