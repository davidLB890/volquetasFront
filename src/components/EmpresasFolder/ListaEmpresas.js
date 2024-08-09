import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert, Nav, Card, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getEmpresasLetra, getEmpresasNombre } from "../../api"; // Importa la función para obtener las empresas por letra y por nombre
import ListaResultadosNombre from "../ListaResultadosNombre"; // Ajusta la ruta según sea necesario
import '../../assets/css/ListaEmpresas.css'; // Archivo CSS adicional para los estilos personalizados

const ListaEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const getToken = useAuth();
  const navigate = useNavigate();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchEmpresas = async (letra) => {
      const usuarioToken = getToken();
      setLoading(true);
      if(!usuarioToken){
        navigate("/");
      }
      try {
        const response = await getEmpresasLetra(letra, usuarioToken);
        setEmpresas(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las empresas:", error.response?.data?.error || error.message);
        setError("Error al obtener las empresas");
        setLoading(false);
      }
    };

    fetchEmpresas(selectedLetter);
  }, [selectedLetter, getToken]);

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setShowSearchResults(false);
    try {
      const response = await getEmpresasNombre(searchTerm, usuarioToken);
      setSearchResults(response.data);
      setShowSearchResults(true);
      setLoading(false);
    } catch (error) {
      console.error("Error al buscar las empresas:", error.response?.data?.error || error.message);
      setError("Error al buscar las empresas");
      setLoading(false);
    }
  };

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId } });
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
                  placeholder="Busca el nombre de la empresa"
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
          {showSearchResults ? (
            <ListaResultadosNombre resultados={searchResults} onSeleccionar={handleNavigateToEmpresa} />
          ) : (
            <>
              {/* Vista para pantallas grandes */}
              <div className="d-none d-md-block">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {empresas.length === 0 ? (
                      <tr>
                        <td colSpan="2">No hay empresas que comiencen con la letra "{selectedLetter}".</td>
                      </tr>
                    ) : (
                      empresas.map((empresa) => (
                        <tr key={empresa.id}>
                          <td>{empresa.nombre}</td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => handleNavigateToEmpresa(empresa.id)}
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
              
              {/* Vista para pantallas pequeñas */}
              <div className="d-md-none">
                {empresas.length === 0 ? (
                  <p>No hay empresas que comiencen con la letra "{selectedLetter}".</p>
                ) : (
                  empresas.map((empresa) => (
                    <div key={empresa.id} className="empresa-item mb-3">
                      <div className="nombre">{empresa.nombre}</div>
                      <Button
                        variant="primary"
                        onClick={() => handleNavigateToEmpresa(empresa.id)}
                        className="mt-2"
                      >
                        Ver Datos
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListaEmpresas;

