import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const CrearUsuarios = () => {

    //const nombre = useRef(null);
    const rol = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const password2 = useRef(null);
    const empleadoId = useRef(null);

    const [empleados, setEmpleados] = useState([]);
    const [botonCrear, setBotonCrear] = useState(false);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    let usuarioToken = localStorage.getItem('apiToken');

    //Verifica que haya token, si no, lo redirige al login
    useEffect(() => {
        if (localStorage.getItem('apiToken') === null) {
          console.log("No hay token");
          navigate("/");
        } else {
              fetch("http://localhost:3000/api/empleados", {
                method: "GET",
                headers: {
                  "authorization": usuarioToken,
                  "Content-Type": "application/json",
                }
              }).then(r => r.json())
                .then(datos => {
                  if (datos.error) {
                    console.error(datos.error);
                    navigate("/");
                    console.log("token malo");
                  }else{
                    let empleados = datos;
                    console.log(empleados);
                    setEmpleados(empleados);    
                  } 
                  //dispatch(guardarUsuarios(usuarios))
                })
        }
    }, []);    

    //CON ESTA FUNCIÓN HAGO EL REGISTRO SEGÚN LOS DATOS BRINDADOS POR EL USUARIO
    const registrarUsuario = () => {
        //let nom = (nombre.current.value);
        let r = (rol.current.value);
        let em = (email.current.value);
        let contra = (password.current.value);
        let contra2 = (password2.current.value);
        let empId = (empleadoId.current.value);

        fetch("http://localhost:3000/api/usuarios", {
            method:"POST",
            headers:{
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            //nombre: nom,
            rol: r,
            email: em,
            //telefonos: telefonos,
            password: contra,
            confirmPassword: contra2, 
            empleadoId: empId
            })
        }).then(r => r.json())
        .then(datos =>{
        console.log(datos);
        if(datos.error){
          console.error(datos.error);
        } else {
          console.log("Usuario creado correctamente", datos);
          // Redirigir o realizar otra acción aquí
        }}).catch(error => {
        console.error('Error al conectar con el servidor:', error);
        });
    }

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
                                {empleados.map(emp => <option key={emp.id} value={emp.id}> {emp.nombre} </option>)}
                            </select>
                        </div>

                        <div className="text-center">
                            <input id="crearUsuario_btn" type="button" onClick={registrarUsuario} disabled={!botonCrear} value="Crear Usuario" className="btn btn-primary styled-button" />
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>

    )

}

export default CrearUsuarios