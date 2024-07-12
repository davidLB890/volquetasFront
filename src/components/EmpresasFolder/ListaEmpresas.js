import React, { useEffect, useState } from "react";
import { getEmpresasLetra } from "../../api";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Spinner, Alert, Nav } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import BuscarEmpresaPorNombre from "./BuscarEmpresaPorNombre"; // Ajusta la ruta según sea necesario

const ListaEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = useAuth();
  const navigate = useNavigate();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchEmpresas = async (letra) => {
      const usuarioToken = getToken();
      setLoading(true);
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

  const handleSearchComplete = (empresasEncontradas) => {
    setEmpresas(empresasEncontradas);
  };

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId } });
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
      <BuscarEmpresaPorNombre onSearchComplete={handleSearchComplete} getToken={getToken} />
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {empresas.length === 0 ? (
            <tr>
              <td colSpan="2">No hay empresas que comiencen con la letra "{selectedLetter}" o que coincidan con "{searchTerm}".</td>
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
    </Container>
  );
};

export default ListaEmpresas;
