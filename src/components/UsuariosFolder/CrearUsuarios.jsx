import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearUsuario, obtenerEmpleados, obtenerUsuarios } from "../../api";
import useAuth from "../../hooks/useAuth";
import Usuarios from "../UsuariosFolder/Usuarios";
import axios from "axios";

const CrearUsuarios = () => {

    //const nombre = useRef(null);
    const rol = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const password2 = useRef(null);
    const empleadoId = useRef(null);

    const [empleados, setEmpleados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
    const [botonCrear, setBotonCrear] = useState(false);
    const [error, setError] = useState("");

    let navigate = useNavigate();
    const getToken = useAuth();

    //let usuarioToken = localStorage.getItem('apiToken');


    //Verifica que haya token, si no, lo redirige al login
    useEffect(() => {
        const usuarioToken = getToken();
        if (usuarioToken === null) {
            navigate("/login");
        } else {
            // Realiza la solicitud para obtener los empleados
            obtenerEmpleados(usuarioToken)
                .then((response) => {
                    const empleados = response.data;
                    setEmpleados(empleados);
                    // Filtrar empleados inmediatamente después de obtenerlos
                    filtrarEmpleados(empleados, usuarios);
                })
                .catch((error) => {
                    console.error("Error al obtener empleados:", error);
                    navigate("/");
                });

            // Realiza la solicitud para obtener los usuarios
            obtenerUsuarios(usuarioToken)
                .then((response) => {
                    const usuarios = response.data;
                    setUsuarios(usuarios);
                    // Filtrar empleados inmediatamente después de obtenerlos
                    filtrarEmpleados(empleados, usuarios);
                })
                .catch((error) => {
                    console.error("Error al obtener usuarios:", error.response.data.error);
                    navigate("/");
                });
        }
    }, [getToken, navigate]);

    useEffect(() => {
        // Filtrar empleados cada vez que cambien empleados y usuarios
        filtrarEmpleados(empleados, usuarios);
    }, [empleados, usuarios]);

    const filtrarEmpleados = (empleados, usuarios) => {
        if (empleados.length > 0 && usuarios.length > 0) {
            // Filtrar empleados habilitados
            let filtrados = empleados.filter(emp => emp.habilitado === true);
          
            // Filtrar empleados que no están asignados a ningún usuario
            let filtrados2 = filtrados.filter(emp => {
              return !usuarios.some(usuario => usuario.empleadoId === emp.id);
            });
          
            setEmpleadosFiltrados(filtrados2);
        }
    };

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
            const datos = response.data;
            if (datos.error) {
                console.error(datos.error);
            } else {
                console.log("Usuario creado correctamente", datos);
            }
        } catch (error) {
            if (error.data) {
                console.error("Error al crear usuario:", error.data.error);
            } else {
                console.error("Error inesperado:", error.error || error.message);
            }
        }
    };
    
/*       const registrarUsuario = () => {
        // Lógica para registrar un usuario usando axios
        const r = rol.current.value;
        const em = email.current.value;
        const contra = password.current.value;
        const contra2 = password2.current.value;
        const empId = empleadoId.current.value;
    
        crearUsuario({
          rol: r,
          email: em,
          password: contra,
          confirmPassword: contra2,
          empleadoId: empId,
            })
          .then((response) => {
            const datos = response.data;
            if (datos.error) {
              console.error(datos.error);
            } else {
              console.log("Usuario creado correctamente", datos);
              // Realizar alguna acción adicional si es necesario
            }
          })
          .catch((error) => {
            console.error(error.response.data.error);
        });

      }; */

    const habilitarBoton = () => {
        let contra = password.current.value;
        let contra2 = password2.current.value;
        let r = rol.current.value;
        let em = email.current.value;
        let empId = empleadoId.current.value;
        let val = 0;

        if (empId !== "") {
            val++;
        }
        if (contra !== "") {
            val++;
        }
        if (contra2 !== "") {
            val++;
        } 
        if (em !== "") {
            val++;
        }
        if (r !== "") {
            val++;
        } 
        if (val === 5) {
            setBotonCrear(true);
        } else {
            setBotonCrear(false);
        }
    }; 

    return (

        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Registro de usuario</h3>
                </div>
                <div className="card-body">
                    <form>

                        <div className="input-group form-group" onChange={habilitarBoton}>
                            <select ref={rol} className="form-control">
                                <option value="">Seleccione su rol</option>
                                <option value="normal">Normal</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="input-group form-group">
                            <input ref={email} type="text" className="form-control" placeholder="Email" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group">
                            <input ref={password} type="password" className="form-control" placeholder="Contraseña" required onChange={habilitarBoton}/>
                        </div>
                        <div className="input-group from-group">
                            <input ref={password2} type="password" className="form-control" placeholder="Confirme contraseña" onChange={habilitarBoton} />
                        </div>

                        <div className="input-group form-group">
                            <select ref={empleadoId} name="slcEmpleado" id="empSlc" className="form-control" onChange={habilitarBoton}>
                                <option value="">Seleccione empleado</option>
                                {empleadosFiltrados.map(emp => <option key={emp.id} value={emp.id}> {emp.nombre} </option>)}
                            </select>
                        </div>

                        <div className="text-center">
                            <input id="crearUsuario_btn" type="button" onClick={registrarUsuario} disabled={!botonCrear} value="Crear Usuario" className="btn btn-primary styled-button" />
                        </div>

                        {/* <div>
                            <section className="row text-center">
                                <Usuarios />
                            </section>
                        </div> */}
                        
                    </form>
                </div>
            </div>
        </div>

    )

}

export default CrearUsuarios