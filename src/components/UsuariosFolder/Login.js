import React, { useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUsuario, obtenerUsuarios, obtenerEmpleado } from "../../api";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import AlertMessage from "../AlertMessage";
import { fetchEmpleados } from "../../features/empleadosSlice";
import { fetchCamiones } from "../../features/camionesSlice";
import { jwtDecode } from "jwt-decode";
import { Button, InputGroup, FormControl } from "react-bootstrap";

const Login = () => {
  const email = useRef(null);
  const password = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Controla el estado del botón crear
  const refs = [email, password];
  const boton = useHabilitarBoton(refs);

  // Verifica si la ruta actual es la de login y si la sesión expiró para mostrar un mensaje
  const location = useLocation();
  const sessionExpired = location.state?.sessionExpired;

  const Ingresar = async () => {
    const em = email.current.value;
    const contra = password.current.value;
    try {
      const response = await loginUsuario(em, contra);
      const datos = response.data;
      if (datos.error) {
        setError(datos.error);
      } else {
        saveToken(datos.token);
        await saveUser(datos.token);
        dispatch(fetchEmpleados(datos.token)); // Fetch empleados after login
        dispatch(fetchCamiones(datos.token)); // Fetch camiones after login
        navigate("/");
      }
    } catch (error) {
      if (error) {
        setError(error.error);
      } else {
        setError("Error inesperado. Inténtelo más tarde.");
      }
    }
  };

  const saveToken = (token) => {
    const timestamp = new Date().getTime(); // Tiempo actual en milisegundos
    localStorage.setItem("apiToken", token);
    localStorage.setItem("tokenTimestamp", timestamp);
    sessionStorage.setItem("activeSession", "true"); // Marcar la sesión como activa
  };

  const saveUser = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      const { rol, id, email } = decodedToken;

      localStorage.setItem("userRol", rol);
      localStorage.setItem("userId", id);
      localStorage.setItem("userEmail", email);
      sessionStorage.setItem("activeSession", "true");

      const responseEmpleado = await obtenerEmpleado(id, token);
      const { nombre } = responseEmpleado.data;

      localStorage.setItem("userNombre", nombre);
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: "20rem" }}>
        <div className="card-header text-center">
          <h3>Inicia sesión</h3>
        </div>
        
        <div className="card-body">
          <form>
            <div className="input-group form-group">
              <input
                ref={email}
                type="text"
                className="form-control"
                placeholder="usuario"
              />
            </div>
            <div className="input-group form-group">
              <InputGroup>
                <FormControl
                  ref={password}
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="contraseña"
                  style={{ height: "calc(1.5em + .75rem + 2px)" }} // Ajusta la altura para que coincida con el botón
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                  style={{ height: "calc(1.5em + .75rem + 2px)" }} // Ajusta la altura para que coincida con el campo de contraseña
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Button>
              </InputGroup>
            </div>
            <AlertMessage type="error" message={error} />
            <div className="text-center">
              <input
                id="l_btn"
                type="button"
                onClick={Ingresar}
                disabled={!boton}
                value="Login"
                className="btn btn-primary styled-button"
              />
            </div>
          </form>
        </div>
        <div className="d-flex justify-content-center links">
          <Link to="/singin">No tengo una cuenta</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
{/* {sessionExpired && (
          <div className="alert alert-warning">
            Sesión expirada. Por favor, inicia sesión de nuevo.
          </div>
        )} */}