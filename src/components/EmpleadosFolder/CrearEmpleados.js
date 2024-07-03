import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { crearEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Form, Button, Card, Alert } from "react-bootstrap";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono"; // Asegúrate de importar AgregarTelefono

const CrearEmpleados = () => {
  const nombreRef = useRef("");
  const cedulaRef = useRef("");
  const rolRef = useRef("");
  const fechaDeIngresoRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [showAgregar, setShowAgregar] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const refs = [nombreRef, cedulaRef, rolRef, fechaDeIngresoRef];
  const boton = useHabilitarBoton(refs);

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const registrarEmpleado = async () => {
    const usuarioToken = getToken();

    const nombre = nombreRef.current.value;
    const cedula = cedulaRef.current.value;
    const rol = rolRef.current.value;
    const fechaEntrada = fechaDeIngresoRef.current.value;

    try {
      const response = await crearEmpleado(
        {
          nombre,
          cedula,
          rol,
          fechaEntrada,
        },
        usuarioToken
      );

      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al crear el empleado");
        setSuccess("");
      } else {
        console.log("Empleado creado correctamente", datos);
        setMostrar(true);
        setEmpleadoSeleccionado({ id: datos.id, nombre: datos.nombre });
        setSuccess("Empleado creado correctamente");
        setError("");

        // Limpiar los campos del formulario
        nombreRef.current.value = "";
        cedulaRef.current.value = "";
        rolRef.current.value = "";
        fechaDeIngresoRef.current.value = "";

        setTimeout(() => {
          setSuccess("");
        }, 10000);
      }
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data || error.message
      );

      let errorMessage = "Error inesperado. Inténtelo más tarde.";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === "object") {
          if (
            error.response.data.detalle &&
            Array.isArray(error.response.data.detalle)
          ) {
            errorMessage = error.response.data.detalle.join(", ");
          } else {
            errorMessage =
              error.response.data.error || JSON.stringify(error.response.data);
          }
        }
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setSuccess("");

      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleTelefonoAgregado = () => {
    setShowAgregar(false);
    setEmpleadoSeleccionado(null);
  };

  const handleMostrarAgregar = () => {
    setShowAgregar(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="mt-5 w-40">
        <Card.Header>
          <Card.Title>Registro de Empleado</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formNombre" className="mb-2">
              <Form.Control
                ref={nombreRef}
                type="text"
                placeholder="Nombre"
                required
              />
            </Form.Group>

            <Form.Group controlId="formCedula" className="mb-2">
              <Form.Control
                ref={cedulaRef}
                type="text"
                placeholder="Cédula"
                required
              />
            </Form.Group>

            <Form.Group controlId="formRol" className="mb-2">
              <Form.Control as="select" ref={rolRef} required>
                <option value="">Seleccione su rol</option>
                <option value="normal">Normal</option>
                <option value="admin">Admin</option>
                <option value="chofer">Chofer</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formFechaIngreso" className="mb-2">
              <Form.Label>Fecha de ingreso</Form.Label>
              <Form.Control
                ref={fechaDeIngresoRef}
                type="date"
                placeholder="Fecha de ingreso"
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="button"
                variant="primary"
                onClick={registrarEmpleado}
                disabled={!boton}
              >
                Crear Empleado
              </Button>
              {mostrar && (
                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={handleMostrarAgregar}
                >
                  Click aquí para agregar teléfono
                </Button>
              )}
            </div>

            {error && <AlertMessage type="error" message={error} className="mb-2" />}
            {success && <AlertMessage type="success" message={success} className="mb-2" />}

            {empleadoSeleccionado && (
              <AgregarTelefono
                show={showAgregar}
                onHide={() => setShowAgregar(false)}
                empleadoId={empleadoSeleccionado.id}
                nombre={empleadoSeleccionado.nombre}
                onTelefonoAgregado={handleTelefonoAgregado}
                className="mb-2"
              />
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CrearEmpleados;
