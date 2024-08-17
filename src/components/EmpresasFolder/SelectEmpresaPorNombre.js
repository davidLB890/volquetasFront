import React, { useState, useRef, useEffect } from "react";
import { Form, InputGroup, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { getEmpresasNombre } from "../../api";
import useAuth from "../../hooks/useAuth";
import "../../assets/css/SelectNombre.css";

const SelectEmpresaPorNombre = ({ onSeleccionar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const getToken = useAuth();
  const inputRef = useRef(null); // Referencia para el campo de entrada
  const listRef = useRef(null); // Referencia para la lista de resultados

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    try {
      const response = await getEmpresasNombre(searchTerm, usuarioToken);
      setResultados(response.data);
      setShowResults(true);
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
    setShowResults(false);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target) && listRef.current && !listRef.current.contains(event.target)) {
      setShowResults(false); // Ocultar la lista si se hace clic fuera
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
      <InputGroup className="mb-0">
        <Form.Control
          type="text"
          placeholder="Busca el nombre de la empresa"
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
        <ListGroup className="result-list" ref={listRef}>
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
    </div>
  );
};

export default SelectEmpresaPorNombre;


