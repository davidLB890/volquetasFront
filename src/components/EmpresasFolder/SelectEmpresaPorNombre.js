import React, { useState } from "react";
import { Form, InputGroup, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { getEmpresasNombre } from "../../api";
import useAuth from "../../hooks/useAuth";
import "../../assets/css/SelectNombre.css"

const SelectEmpresaPorNombre = ({ onSeleccionar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false); // Controlar la visibilidad de la lista de resultados
  const getToken = useAuth();

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    try {
      const response = await getEmpresasNombre(searchTerm, usuarioToken);
      setResultados(response.data);
      setShowResults(true); // Mostrar los resultados después de buscar
      setLoading(false);
    } catch (error) {
      console.error("Error al buscar las empresas:", error.response?.data?.error || error.message);
      setError("Error al buscar las empresas");
      setLoading(false);
    }
  };

  const handleSeleccionar = (id, nombre) => {
    onSeleccionar(id, nombre);
    setSearchTerm(nombre);
    setShowResults(false); // Ocultar la lista de resultados después de seleccionar una opción
  };

  return (
    <>
      <InputGroup className="mb-0">
        <Form.Control
          type="text"
          placeholder="Busca el nombre de la empresa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setShowResults(resultados.length > 0)} // Mostrar resultados al hacer clic en el campo de texto si ya hay resultados
          style={{ height: "34px" }}
        />
        <Button
          variant="outline-secondary"
          onClick={handleSearch}
          style={{ height: "34px", display: "flex", alignItems: "center" }}
          disabled={!searchTerm.trim()} // Deshabilitar si searchTerm está vacío o solo contiene espacios en blanco
        >
          <i className="bi bi-search"></i>
        </Button>
      </InputGroup>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {showResults && (
        <ListGroup className="result-list">
          {resultados.slice(0, 10).map((empresa) => (
            <ListGroup.Item
              key={empresa.id}
              action
              onClick={() => handleSeleccionar(empresa.id, empresa.nombre)}
            >
              {empresa.nombre}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default SelectEmpresaPorNombre;

