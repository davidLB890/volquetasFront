import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom";
import { crearEmpleado } from "../../api";

const CrearEmpleados = () => {
    const nombre = useRef(null);
    const cedula = useRef(null);
    const rol = useRef(null);
    const [botonIngreso, setBotonIngreso] = useState(false);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    let usuarioToken = localStorage.getItem('apiToken');

    useEffect(() => {
        if (usuarioToken === null || usuarioToken === "undefined") {
            navigate("/");
        }
    }, [usuarioToken, navigate]);

    // CON ESTA FUNCIÓN HAGO EL REGISTRO SEGÚN LOS DATOS BRINDADOS POR EL USUARIO
    const registrarEmpleado = async () => {
        const name = nombre.current.value;
        const ci = cedula.current.value;
        const r = rol.current.value;

        crearEmpleado({
            nombre: name,
            cedula: ci,
            rol: r
            }, usuarioToken)
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
            console.error("Error al conectar con el servidor:", error);
        });
    }

    const habilitarBoton = () => {
        let name = nombre.current.value;
        let ci = cedula.current.value;
        let r = rol.current.value;

        let val = 0;

        if (name !== "") {
            val++;
        }
        if (ci !== "") {
            val++;
        }
        if (r !== "") {
            val++;
        }

        if (val === 3) {
            setBotonIngreso(true);
        } else {
            setBotonIngreso(false);
        }
    };

    return (
        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Registro de empleado</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <input ref={nombre} type="text" className="form-control" placeholder="Nombre" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group">
                            <input ref={cedula} type="text" className="form-control" placeholder="Cédula" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group" onChange={habilitarBoton}>
                            <select ref={rol} className="form-control">
                                <option value="">Seleccione su rol</option>
                                <option value="normal">Normal</option>
                                <option value="admin">Admin</option>
                                <option value="chofer">Chofer</option>
                            </select>
                        </div>

                        <div className="text-center">
                            <input id="crearEmpleado_btn" type="button" onClick={registrarEmpleado} disabled={!botonIngreso} value="Crear Empleado" className="btn btn-primary styled-button" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearEmpleados;

/* const CrearEmpleados = () => {
    const nombre = useRef(null);
    const cedula = useRef(null);
    const rol = useRef(null);
    const [botonIngreso, setBotonIngreso] = useState(false);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    let usuarioToken = localStorage.getItem('apiToken');

    useEffect(() => {
        if (usuarioToken === null || usuarioToken === "undefined") {
            navigate("/");
        }
    }, [usuarioToken, navigate]);

    // CON ESTA FUNCIÓN HAGO EL REGISTRO SEGÚN LOS DATOS BRINDADOS POR EL USUARIO
    const registrarEmpleado = async () => {
        let name = nombre.current.value;
        let ci = cedula.current.value;
        let r = rol.current.value;

        try {
            const response = await crearUsuario({
                nombre: name,
                cedula: ci,
                rol: r,
                // telefonos: telefonos,
            }, {
                headers: {
                    "authorization": usuarioToken,
                    "Content-Type": "application/json"
                }
            });
            const datos = response.data;

            if (datos.error) {
                console.error(datos.error);
                setError(datos.error);
            } else {
                console.log("Usuario creado correctamente", datos);
                // Redirigir o realizar otra acción aquí
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setError('Error al conectar con el servidor');
        }
    }

    const habilitarBoton = () => {
        let name = nombre.current.value;
        let ci = cedula.current.value;
        let r = rol.current.value;

        let val = 0;

        if (name !== "") {
            val++;
        }
        if (ci !== "") {
            val++;
        }
        if (r !== "") {
            val++;
        }

        if (val === 3) {
            setBotonIngreso(true);
        } else {
            setBotonIngreso(false);
        }
    };

    return (
        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Registro de empleado</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <input ref={nombre} type="text" className="form-control" placeholder="Nombre" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group">
                            <input ref={cedula} type="text" className="form-control" placeholder="Cédula" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group" onChange={habilitarBoton}>
                            <select ref={rol} className="form-control">
                                <option value="">Seleccione su rol</option>
                                <option value="normal">Normal</option>
                                <option value="admin">Admin</option>
                                <option value="chofer">Chofer</option>
                            </select>
                        </div>

                        <div className="text-center">
                            <input id="crearEmpleado_btn" type="button" onClick={registrarEmpleado} disabled={!botonIngreso} value="Crear Empleado" className="btn btn-primary styled-button" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearEmpleados; */
/* const CrearEmpleados = () => {

    const nombre = useRef(null);
    const cedula = useRef(null);
    const rol = useRef(null);
    //const telefono = useRef(null);
    //const [telefonos, setTelefonos] = useState([]);}
    
    const [botonIngreso, setBotonIngreso] = useState(false);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    let usuarioToken = localStorage.getItem('apiToken');

    useEffect(() => {
        if (usuarioToken === null || usuarioToken === "undefined") {
          navigate("/");
        }
    }, []);

    //CON ESTA FUNCIÓN HAGO EL REGISTRO SEGÚN LOS DATOS BRINDADOS POR EL USUARIO
    const registrarEmpleado = () => {
        let name = (nombre.current.value);
        let ci = (cedula.current.value);
        let r = (rol.current.value);
        
        fetch("http://localhost:3000/api/empleados", {
            method:"POST",
            headers:{
            "authorization": usuarioToken,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            nombre: name,
            cedula: ci,
            rol: r,
            //telefonos: telefonos,
        })
        }).then(r => r.json())
        .then(datos =>{
        console.log(datos);
        if(datos.error){
          console.error(datos.error);
        } else {
          console.log("Usuario creado correctamente", datos);
          // Redirigir o realizar otra acción aquí
    }
  })
  .catch(error => {
      console.error('Error al conectar con el servidor:', error);
  });

    }

    /* useEffect(() => {
        habilitarBoton();
    }, [telefonos]);

    const agregarTelefono = () => {
        let nuevoTelefono = telefono.current.value;
        if (nuevoTelefono) {
            setTelefonos([...telefonos, nuevoTelefono]);
            telefono.current.value = ""; // Clear the input
        }
    };

    const eliminarTelefono = (index) => {
        setTelefonos(telefonos.filter((_, i) => i !== index));
    }; */

    /* const habilitarBoton = () => {
        let name = nombre.current.value;
        let ci = cedula.current.value;
        let r = rol.current.value;

        let val = 0;

        if (name !== "") {
            val++;
        }
        if (ci !== "") {
            val++;
        }
        if (r !== "") {
            val++;
        }  */
        /*if (telefonos.length > 0) {
            val++;
        }  */
/*         if (val === 3) {
            setBotonIngreso(true);
        } else {
            setBotonIngreso(false);
        }
    };  */

/*     return (

        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Registro de empleado</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <input ref={nombre} type="text" className="form-control" placeholder="Nombre" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group">
                            <input ref={cedula} type="text" className="form-control" placeholder="Cédula" required onChange={habilitarBoton}/>
                        </div>

                        <div className="input-group form-group" onChange={habilitarBoton}>
                            <select ref={rol} className="form-control">
                                <option value="">Seleccione su rol</option>
                                <option value="normal">Normal</option>
                                <option value="admin">Admin</option>
                                <option value="chofer">Chofer</option>
                            </select>
                        </div> */
                        
                        {/* <div className="input-group form-group">
                            <input ref={telefono} type="text" className="form-control" placeholder="Add phone number"/>
                            <button type="button" className="btn btn-primary" onClick={agregarTelefono}>Add</button>
                        </div>
                        <ul className="list-group">
                            {telefonos.map((telefono, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {telefono}
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminarTelefono(index)}>Remove</button>
                                </li>
                            ))}
                        </ul> */}
                        /*<div className="text-center">
                            <input id="crearEmpleado_btn" type="button" onClick={registrarEmpleado} disabled={!botonIngreso} value="Crear Empelado" className="btn btn-primary styled-button" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CrearEmpleados */