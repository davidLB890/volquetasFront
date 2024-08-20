import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { getParticularNombre } from "../../api";
import useAuth from "../../hooks/useAuth";
import "../../assets/css/SelectNombre.css";

const SelectParticularPorNombre = ({ onSeleccionar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const getToken = useAuth();
  const inputRef = useRef(null); // Para detectar clics fuera del componente
  const listRef = useRef(null); // Referencia para la lista de resultados

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    try {
      const response = await getParticularNombre(searchTerm, usuarioToken);
      setResultados(response.data);
      setShowResults(true);
      setLoading(false);
    } catch (error) {
      console.error("Error al buscar los particulares:", error.response?.data?.error || error.message);
      setError("Error al buscar los particulares");
      setLoading(false);
    }
  };

  const handleSeleccionar = (id, nombre) => {
    onSeleccionar(id, nombre);
    setSearchTerm(nombre);
    setShowResults(false);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowResults(false); // Ocultar lista si el clic fue fuera del componente
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={inputRef}>
      <Form.Group controlId="searchFormGroup" className="mb-0">
        <InputGroup className="mb-0">
          <Form.Control
            type="text"
            placeholder="Busca el nombre del particular"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setShowResults(resultados.length > 0)}
            style={{ height: "34px" }}
          />
          <Button
            variant="outline-secondary"
            onClick={handleSearch}
            style={{ height: "34px", display: "flex", alignItems: "center" }}
            disabled={!searchTerm.trim()}
          >
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {showResults && (
          <ListGroup className="result-list" ref={listRef} style={{ position: "absolute", zIndex: 1000 }}>
            {resultados.slice(0, 10).map((particular) => (
              <ListGroup.Item
                key={particular.id}
                action
                onClick={() => handleSeleccionar(particular.id, particular.nombre)}
              >
                {particular.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>
    </div>
  );
};

export default SelectParticularPorNombre;