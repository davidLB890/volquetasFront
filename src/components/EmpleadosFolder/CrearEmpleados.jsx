import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { crearEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Button } from "react-bootstrap";
import AgregarTelefono from '../AgregarTelefono'; // Asegúrate de importar AgregarTelefono

const CrearEmpleados = () => {
  const nombreRef = useRef('');
  const cedulaRef = useRef('');
  const rolRef = useRef('');
  const fechaDeIngresoRef = useRef('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        setSuccess('');
      } else {
        console.log("Empleado creado correctamente", datos);
        setMostrar(true);
        setEmpleadoSeleccionado({ id: datos.id, nombre: datos.nombre });
        setSuccess("Empleado creado correctamente");
        setError('');

        // Limpiar los campos del formulario
        nombreRef.current.value = '';
        cedulaRef.current.value = '';
        rolRef.current.value = '';
        fechaDeIngresoRef.current.value = '';

        setTimeout(() => {
          setSuccess('');
        }, 10000);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error.response?.data || error.message);

      let errorMessage = "Error inesperado. Inténtelo más tarde.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === 'object') {
          if (error.response.data.detalle && Array.isArray(error.response.data.detalle)) {
            errorMessage = error.response.data.detalle.join(', ');
          } else {
            errorMessage = error.response.data.error || JSON.stringify(error.response.data);
          }
        }
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setSuccess('');

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
    <div className="d-flex justify-content-center h-100">
      <div className="mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Registro de Empleado</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <input ref={nombreRef} type="text" className="form-control" placeholder="Nombre" required />
                </div>

                <div className="form-group">
                  <input ref={cedulaRef} type="text" className="form-control" placeholder="Cédula" required />
                </div>

                <div className="form-group">
                  <select ref={rolRef} className="form-control">
                    <option value="">Seleccione su rol</option>
                    <option value="normal">Normal</option>
                    <option value="admin">Admin</option>
                    <option value="chofer">Chofer</option>
                  </select>
                </div>

                <div className="form-group">
                  <input ref={fechaDeIngresoRef} type="date" className="form-control" placeholder="Fecha de ingreso" required />
                </div>

                <div className="form-group text-center">
                  <button type="button" className="btn btn-primary" onClick={registrarEmpleado} disabled={!boton}>Crear Empleado</button>
                  {mostrar && <Button variant="secondary" className="text-center" onClick={handleMostrarAgregar}>Click aquí para agregar teléfono</Button>}
                </div>

                {error && <AlertMessage type="error" message={error} />}
                {success && <AlertMessage type="success" message={success} />}
                
                {empleadoSeleccionado && <AgregarTelefono
                  show={showAgregar}
                  onHide={() => setShowAgregar(false)}
                  empleadoId={empleadoSeleccionado.id}
                  nombre={empleadoSeleccionado.nombre}
                  onTelefonoAgregado={handleTelefonoAgregado} />}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearEmpleados;
