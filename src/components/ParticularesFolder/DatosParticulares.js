import React, { useEffect, useState } from "react";
import { getParticularId } from "../../api";
import { useLocation } from "react-router-dom";
import { Card, Spinner, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const DatosParticular = () => {
  const [particular, setParticular] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = useAuth();
  const location = useLocation();
  const { particularId } = location.state;

  useEffect(() => {
    const fetchParticular = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getParticularId(particularId, usuarioToken);
        setParticular(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el particular:", error.response?.data?.error || error.message);
        setError("Error al obtener el particular");
        setLoading(false);
      }
    };

    fetchParticular();
  }, [particularId, getToken]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Card className="mt-3">
        <Card.Header><h2>{particular.nombre}</h2></Card.Header>
        <Card.Body>
          <Card.Text><strong>Cédula:</strong> {particular.cedula}</Card.Text>
          <Card.Text><strong>Email:</strong> {particular.email}</Card.Text>
          <Card.Text><strong>Descripción:</strong> {particular.descripcion}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DatosParticular;
