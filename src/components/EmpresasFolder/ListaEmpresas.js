import React, { useEffect, useState } from "react";
import { getEmpresas } from "../../api";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ListaEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getEmpresas(usuarioToken);
        setEmpresas(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las empresas:", error.response?.data?.error || error.message);
        setError("Error al obtener las empresas");
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [getToken]);

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId } });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-4">
      <h2>"todo" hacerle el buscador por letra</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
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
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaEmpresas;
