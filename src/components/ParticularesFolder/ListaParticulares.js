import React, { useEffect, useState } from "react";
import { getParticularLetra } from "../../api";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Spinner, Alert, Nav } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import BuscarParticularPorNombre from "./BuscarParticularPorNombre"; // Ajusta la ruta según sea necesario

const ListaParticulares = () => {
  const [particulares, setParticulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = useAuth();
  const navigate = useNavigate();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchParticulares = async (letra) => {
      const usuarioToken = getToken();
      setLoading(true);
      try {
        const response = await getParticularLetra(letra, usuarioToken);
        setParticulares(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los particulares:", error.response?.data?.error || error.message);
        setError("Error al obtener los particulares");
        setLoading(false);
      }
    };

    fetchParticulares(selectedLetter);
  }, [selectedLetter, getToken]);

  const handleSearchComplete = (particularesEncontrados) => {
    setParticulares(particularesEncontrados);
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", { state: { particularId } });
  };

  const handleLetterClick = (letra) => {
    setSearchTerm("");
    setSelectedLetter(letra);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-4">
      <BuscarParticularPorNombre onSearchComplete={handleSearchComplete} getToken={getToken} />
      <Nav className="pagination justify-content-center">
        <Nav.Item>
          <Nav.Link
            className="page-link"
            onClick={() => handleLetterClick(selectedLetter === 'A' ? 'Z' : letters[letters.indexOf(selectedLetter) - 1])}
          >
            <i className="fa fa-angle-left"></i>
            <span className="sr-only">Previous</span>
          </Nav.Link>
        </Nav.Item>
        {letters.map((letra) => (
          <Nav.Item key={letra}>
            <Nav.Link
              className={`page-link ${letra === selectedLetter ? 'active' : ''}`}
              onClick={() => handleLetterClick(letra)}
            >
              {letra}
            </Nav.Link>
          </Nav.Item>
        ))}
        <Nav.Item>
          <Nav.Link
            className="page-link"
            onClick={() => handleLetterClick(selectedLetter === 'Z' ? 'A' : letters[letters.indexOf(selectedLetter) + 1])}
          >
            <i className="fa fa-angle-right"></i>
            <span className="sr-only">Next</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {particulares.length === 0 ? (
            <tr>
              <td colSpan="3">No hay particulares que comiencen con la letra "{selectedLetter}" o que coincidan con "{searchTerm}".</td>
            </tr>
          ) : (
            particulares.map((particular) => (
              <tr key={particular.id}>
                <td>{particular.nombre}</td>
                <td>{particular.descripcion}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleNavigateToParticular(particular.id)}
                  >
                    Ver Datos
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaParticulares;

