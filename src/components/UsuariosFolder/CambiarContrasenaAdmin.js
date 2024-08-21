import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { obtenerUsuarios, cambiarContrasenaAdministrador } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CambiarContrasenaAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const getToken = useAuth();
    const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate("/login");
        return;
      } else if (localStorage.getItem('userRol') !== "admin") {
        navigate("/");
        return;
      }
      setLoading(true);
      try {
        const response = await obtenerUsuarios(usuarioToken);
        setUsuarios(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener usuarios:", error.response?.data?.error || error.message);
        setError("Error al obtener usuarios");
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [getToken]);

  const handlePasswordChange = async () => {
    const usuarioToken = getToken();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      await cambiarContrasenaAdministrador(selectedUser, newPassword, confirmNewPassword, usuarioToken);
      setSuccess("Contraseña cambiada exitosamente");
      setSelectedUser("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: "100%", padding: "20px" }}>
      <h3 className="text-center mb-4">Cambiar Contraseña de Usuario</h3>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {loading && <Spinner animation="border" className="d-block mx-auto" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form>
            <Form.Group controlId="formUsuario">
              <Form.Label>Seleccionar Usuario</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.email} value={usuario.email}>
                    {usuario.nombre} ({usuario.email})
                  </option>
                ))}
              </Form.Control>
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
              disabled={loading || !selectedUser || !newPassword || !confirmNewPassword}
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

export default CambiarContrasenaAdmin;