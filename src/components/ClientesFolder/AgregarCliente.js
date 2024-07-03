import React, { useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import AgregarClienteParticular from "./AgregarClienteParticular";
import AgregarClienteEmpresa from "./AgregarClienteEmpresa";
import { useNavigate } from "react-router-dom";

const AgregarCliente = () => {
  const getToken = useAuth();
  const [tipo, setTipo] = useState("");
  const [mostrarParticular, setMostrarParticular] = useState(false);
  const [mostrarEmpresa, setMostrarEmpresa] = useState(false);

  const navigate = useNavigate();

  const handleChangeTipo = (e) => setTipo(e.target.value);


  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }

    if (tipo === "particular") {
      setMostrarParticular(true);
      setMostrarEmpresa(false);
    } else if (tipo === "empresa") {
      setMostrarEmpresa(true);
      setMostrarParticular(false);
    } else {
      setMostrarParticular(false);
      setMostrarEmpresa(false);
    }
  }, [getToken, tipo]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="mt-5 w-50">
        <Card.Header>
          <Card.Title>Registro de Cliente</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="selectClienteTipo">
            <Form.Label>Tipo:</Form.Label>
            <Form.Control as="select" value={tipo} onChange={handleChangeTipo} >
              <option value="">¿Qué tipo de cliente?</option>
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
            </Form.Control>
          </Form.Group>

          {mostrarEmpresa && <AgregarClienteEmpresa />}
          {mostrarParticular && <AgregarClienteParticular />}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarCliente;
