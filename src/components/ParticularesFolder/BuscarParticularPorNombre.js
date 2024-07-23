import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getParticularNombre } from "../../api";
import useAuth from "../../hooks/useAuth";
import ListaResultadosNombre from "../ListaResultadosNombre"; // Ajusta la ruta según sea necesario

const BuscarParticularPorNombre = ({ onSeleccionar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [particularSeleccionado, setParticularSeleccionado] = useState(null);
  const getToken = useAuth();

  const handleSearch = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setParticularSeleccionado(null); // Limpiar el particular seleccionado antes de una nueva búsqueda
    onSeleccionar(null, ""); // Limpiar el ID y el nombre del particular en el componente padre
    try {
      const response = await getParticularNombre(searchTerm, usuarioToken);
      setResultados(response.data);
      setLoading(false);
      setHasSearched(true); // Establece el estado para indicar que se ha realizado una búsqueda
    } catch (error) {
      console.error("Error al buscar los particulares:", error.response?.data?.error || error.message);
      setError("Error al buscar los particulares");
      setLoading(false);
      setHasSearched(true); // Establece el estado para indicar que se ha realizado una búsqueda
    }
  };

  const handleSeleccionar = (id, nombre) => {
    setParticularSeleccionado({ id, nombre });
    onSeleccionar(id, nombre);
    setSearchTerm(""); // Limpiar el término de búsqueda para evitar mostrar el término de búsqueda anterior
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder={particularSeleccionado ? `Particular seleccionado: ${particularSeleccionado.nombre}` : "Busca el nombre del particular"}
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
      {hasSearched && !particularSeleccionado && (
        <ListaResultadosNombre resultados={resultados} onSeleccionar={handleSeleccionar} />
      )}
    </>
  );
};

export default BuscarParticularPorNombre;
