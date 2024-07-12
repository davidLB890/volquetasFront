import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getEmpresasNombre, getEmpresaId } from "../../api";
import ListaResultadosNombre from "../PedidosFolder/ListaResultadosNombre"; // Ajusta la ruta según sea necesario

const BuscarEmpresaPorNombre = ({ onSeleccionar, getToken }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setShowResults(false);
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

  const handleSeleccionar = async (empresa) => {
    const usuarioToken = getToken();
    try {
      const response = await getEmpresaId(empresa.id, usuarioToken);
      onSeleccionar(response.data);
    } catch (error) {
      console.error("Error al obtener la empresa:", error.response?.data?.error || error.message);
      setError("Error al obtener la empresa");
    }
    setShowResults(false);
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Busca el nombre de la empresa"
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
      {showResults && <ListaResultadosNombre resultados={resultados} onSeleccionar={handleSeleccionar} />}
    </>
  );
};

export default BuscarEmpresaPorNombre;
