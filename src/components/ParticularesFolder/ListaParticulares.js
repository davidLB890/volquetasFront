import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert, Nav, Card, Form, Row, Col } from "react-bootstrap";
import { getParticularLetra, getParticularNombre } from "../../api"; 
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ListaResultadosNombre from "../ListaResultadosNombre"; // Ajusta la ruta según sea necesario
import "../../assets/css/ListaParticulares.css"; 

const ListaParticulares = () => {
  const [particulares, setParticulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const getToken = useAuth();
  const navigate = useNavigate();

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setShowSearchResults(false);
    try {
      const response = await getParticularNombre(searchTerm, usuarioToken);
      setSearchResults(response.data);
      setShowSearchResults(true);
      setLoading(false);
    } catch (error) {
      console.error("Error al buscar los particulares:", error.response?.data?.error || error.message);
      setError("Error al buscar los particulares");
      setLoading(false);
    }
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", { state: { particularId } });
  };

  const handleLetterClick = (letra) => {
    setSearchTerm("");
    setSelectedLetter(letra);
    setShowSearchResults(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-4">
      <Card className="mt-3">
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Busca el nombre del particular"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                />
              </Col>
              <Col>
                <Button onClick={handleSearch} variant="primary">Buscar</Button>
              </Col>
            </Row>
          </Form>
          <Nav className="pagination justify-content-center">
            <Nav.Item>
              <Nav.Link
                className="page-link"
                onClick={() =>
                  handleLetterClick(
                    selectedLetter === "A" ? "Z" : letters[letters.indexOf(selectedLetter) - 1]
                  )
                }
              >
                <i className="fa fa-angle-left"></i>
                <span className="sr-only">Previous</span>
              </Nav.Link>
            </Nav.Item>
            {letters.map((letra) => (
              <Nav.Item key={letra}>
                <Nav.Link
                  className={`page-link ${letra === selectedLetter ? "active" : ""}`}
                  onClick={() => handleLetterClick(letra)}
                >
                  {letra}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item>
              <Nav.Link
                className="page-link"
                onClick={() =>
                  handleLetterClick(
                    selectedLetter === "Z" ? "A" : letters[letters.indexOf(selectedLetter) + 1]
                  )
                }
              >
                <i className="fa fa-angle-right"></i>
                <span className="sr-only">Next</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {showSearchResults ? (
            <ListaResultadosNombre
              resultados={searchResults}
              onSeleccionar={handleNavigateToParticular}
            />
          ) : (
            <div className="table-responsive d-none d-md-block">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {particulares.length === 0 ? (
                    <tr>
                      <td colSpan="2">
                        No hay particulares que comiencen con la letra "{selectedLetter}".
                      </td>
                    </tr>
                  ) : (
                    particulares.map((particular) => (
                      <tr key={particular.id}>
                        <td>{particular.nombre}</td>
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
            </div>
          )}
          {/* Versión en columnas para pantallas pequeñas */}
          <div className="d-md-none">
            {particulares.length === 0 ? (
              <p>No hay particulares que comiencen con la letra "{selectedLetter}".</p>
            ) : (
              particulares.map((particular) => (
                <div key={particular.id} className="particular-item">
                  <h5>{particular.nombre}</h5>
                  <Button
                    variant="primary"
                    onClick={() => handleNavigateToParticular(particular.id)}
                  >
                    Ver Datos
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListaParticulares;

