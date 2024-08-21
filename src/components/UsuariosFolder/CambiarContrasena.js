import React, { useState } from "react";
import { Form, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { cambiarContrasena } from "../../api";
import useAuth from "../../hooks/useAuth";

const CambiarContrasena = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const getToken = useAuth();

  // Get user email from localStorage
  const emailUsuario = localStorage.getItem("userEmail");

  const handlePasswordChange = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas nuevas no coinciden");
      setLoading(false);
      return;
    }

    try {
      await cambiarContrasena(emailUsuario, oldPassword, newPassword, confirmNewPassword, usuarioToken);
      setSuccess("Contraseña cambiada exitosamente");
      setTimeout(() => {
        setSuccess("");
      }, 1500);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: "600px", padding: "20px" }}>
      <h3 className="text-center mb-4">Cambiar Contraseña</h3>
      <Row>
        <Col xs={12}>
          {loading && <Spinner animation="border" className="d-block mx-auto" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form>
            <h4 className="text-center mb-4">{emailUsuario}</h4>

            <Form.Group controlId="formOldPassword">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmNewPassword">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={handlePasswordChange}
              disabled={loading || !oldPassword || !newPassword || !confirmNewPassword}
              className="w-100 mt-3"
            >
              Cambiar Contraseña
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CambiarContrasena;
