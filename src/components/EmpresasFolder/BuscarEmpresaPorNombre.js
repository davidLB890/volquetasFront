import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getEmpresasNombre } from "../../api";
import useAuth from "../../hooks/useAuth";
import ListaResultadosNombre from "../ListaResultadosNombre"; // Ajusta la ruta según sea necesario

const BuscarEmpresaPorNombre = ({ onSeleccionar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Estado para verificar si se ha hecho una búsqueda
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null); // Estado para la empresa seleccionada
  const getToken = useAuth();

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setEmpresaSeleccionada(null); // Limpiar la empresa seleccionada antes de una nueva búsqueda
    onSeleccionar(null, ""); // Limpiar el ID y el nombre de la empresa en el componente padre
    try {
      const response = await getEmpresasNombre(searchTerm, usuarioToken);
      setResultados(response.data);
      setLoading(false);
      setHasSearched(true); // Establece el estado para indicar que se ha realizado una búsqueda
    } catch (error) {
      console.error("Error al buscar las empresas:", error.response?.data?.error || error.message);
      setError("Error al buscar las empresas");
      setLoading(false);
      setHasSearched(true); // Establece el estado para indicar que se ha realizado una búsqueda
    }
  };

  const handleSeleccionar = (id, nombre) => {
    setEmpresaSeleccionada({ id, nombre });
    onSeleccionar(id, nombre);
    setSearchTerm(""); // Clear search term to prevent showing previous search term
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder={empresaSeleccionada ? `Empresa seleccionada: ${empresaSeleccionada.nombre}` : "Busca el nombre de la empresa"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={handleSearch} variant="primary">Buscar</Button>
        </Col>
      </Row>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {hasSearched && !empresaSeleccionada && (
        <ListaResultadosNombre resultados={resultados} onSeleccionar={handleSeleccionar} />
      )}
    </>
  );
};

export default BuscarEmpresaPorNombre;
