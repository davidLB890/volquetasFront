import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearUsuario, getEmpleadosSinUsuario } from "../../api";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import AlertMessage from "../AlertMessage";

const Singin = () => {
    const rol = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const password2 = useRef(null);
    const empleadoId = useRef(null);
    
    const [empleados, setEmpleados] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // controla el estado del botón crear
    const refs = [rol, email, password, password2, empleadoId];
    const botonCrear = useHabilitarBoton(refs);

    const navigate = useNavigate();

    useEffect(() => {
        getEmpleadosSinUsuario()
            .then((response) => {
                const empleados = response.data;
                setEmpleados(empleados);
            })
            .catch((error) => {
                console.error("Error al obtener empleados:", error);
                setError('Error al obtener empleados. Inténtelo más tarde.');
            });
    }, [navigate]);

    const registrarUsuario = async () => {
        const r = rol.current.value;
        const em = email.current.value;
        const contra = password.current.value;
        const contra2 = password2.current.value;
        const empId = empleadoId.current.value;

        try {
            const response = await crearUsuario({
                rol: r,
                email: em,
                password: contra,
                confirmPassword: contra2,
                empleadoId: empId,
            });
            console.log("Usuario creado correctamente", response.data);
            setSuccess("Usuario creado correctamente");
            setError("");
            navigate("/login");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Error inesperado. Inténtelo más tarde.";
            console.error("Error al crear usuario:", errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header text-center">
                    <h3>Regístrate</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <select ref={rol} className="form-control">
                                <option value="">Seleccione su rol</option>
                                <option value="normal">Normal</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="input-group form-group">
                            <input ref={email} type="text" className="form-control" placeholder="Email" required />
                        </div>

                        <div className="input-group form-group">
                            <input ref={password} type="password" className="form-control" placeholder="Contraseña" required />
                        </div>
                        <div className="input-group form-group">
                            <input ref={password2} type="password" className="form-control" placeholder="Confirme contraseña" />
                        </div>

                        <div className="input-group form-group">
                            <select ref={empleadoId} name="slcEmpleado" id="empSlc" className="form-control">
                                <option value="">Seleccione empleado</option>
                                {empleados.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                            </select>
                        </div>

                        <AlertMessage type="error" message={error} />
                        <AlertMessage type="success" message={success} />

                        <div className="text-center">
                            <input id="crearUsuario_btn" type="button" onClick={registrarUsuario} disabled={!botonCrear} value="Crear Usuario" className="btn btn-primary styled-button" />
                        </div>

                        <div className="d-flex justify-content-center links">
                            <Link to="/login">Ya tengo una cuenta</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Singin;
