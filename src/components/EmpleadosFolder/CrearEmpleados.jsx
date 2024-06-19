import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";

const CrearEmpleados = () => {
  const nombreRef = useRef('');
  const cedulaRef = useRef('');
  const rolRef = useRef('');
  const fechaDeIngresoRef = useRef('');
  const [telefonos, setTelefonos] = useState(['']);
  const [botonIngreso, setBotonIngreso] = useState(false);
  const [error, setError] = useState('');

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
      const response = await crearEmpleado({
        nombre,
        cedula,
        rol,
        fechaEntrada,
        //telefonos: telefonos.filter(tel => tel.trim() !== '') // Filtrar teléfonos vacíos
      }, usuarioToken);

      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error);
      } else {
        console.log("Empleado creado correctamente", datos);
        // Redirigir a otra página o realizar alguna acción adicional
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const habilitarBoton = () => {
    const name = nombreRef.current.value;
    const ci = cedulaRef.current.value;
    const r = rolRef.current.value;
    const fecha = fechaDeIngresoRef.current.value;

    if (name && ci && r && fecha) {
      setBotonIngreso(true);
    } else {
      setBotonIngreso(false);
    }
  };

  const handleAgregarTelefono = () => {
    setTelefonos([...telefonos, '']);
  };

  const handleTelefonoChange = (index, value) => {
    const nuevosTelefonos = [...telefonos];
    nuevosTelefonos[index] = value;
    setTelefonos(nuevosTelefonos);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Registro de Empleado</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <input ref={nombreRef} type="text" className="form-control" placeholder="Nombre" required onChange={habilitarBoton} />
                </div>

                <div className="form-group">
                  <input ref={cedulaRef} type="text" className="form-control" placeholder="Cédula" required onChange={habilitarBoton} />
                </div>

                <div className="form-group">
                  <select ref={rolRef} className="form-control" onChange={habilitarBoton}>
                    <option value="">Seleccione su rol</option>
                    <option value="normal">Normal</option>
                    <option value="admin">Admin</option>
                    <option value="chofer">Chofer</option>
                  </select>
                </div>

                <div className="form-group">
                  <input ref={fechaDeIngresoRef} type="date" className="form-control" placeholder="Fecha de ingreso" required onChange={habilitarBoton} />
                </div>

                <div className="form-group">
                  <label>Teléfonos:</label>
                  {telefonos.map((telefono, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Teléfono ${index + 1}`}
                        value={telefono}
                        onChange={(e) => handleTelefonoChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary mb-2" onClick={handleAgregarTelefono}>Agregar Teléfono</button>
                </div>

                <div className="form-group text-center">
                  <button type="button" className="btn btn-primary" onClick={registrarEmpleado} disabled={!botonIngreso}>Crear Empleado</button>
                </div>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearEmpleados;




/* import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";

const CrearEmpleados = () => {
  const nombre = useRef(null);
  const cedula = useRef(null);
  const rol = useRef(null);
  const fechaDeIngreso = useRef(null);
  const [telefonos, setTelefonos] = useState(['']); // Estado para almacenar teléfonos
  const [botonIngreso, setBotonIngreso] = useState(false);
  const [error, setError] = useState("");

  let navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const registrarEmpleado = async () => {
    const usuarioToken = getToken();

    const name = nombre.current.value;
    const ci = cedula.current.value;
    const r = rol.current.value;
    const fecha = fechaDeIngreso.current.value;

    try {
      const response = await crearEmpleado({
        nombre: name,
        cedula: ci,
        rol: r,
        fechaEntrada: fecha,
        telefonos: telefonos.filter(t => t !== '') // Enviar solo los teléfonos no vacíos
      }, usuarioToken);
      
      const datos = response.data;
      
      if (datos.error) {
        console.error(datos.error);
        setError(datos.error);
      } else {
        console.log("Usuario creado correctamente", datos);
        // Redirigir o realizar otra acción aquí, si es necesario
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const habilitarBoton = () => {
    let name = nombre.current.value;
    let ci = cedula.current.value;
    let r = rol.current.value;
    let fecha = fechaDeIngreso.current.value;

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
    if (fecha !== "") {
      val++;
    }

    if (val === 4) {
      setBotonIngreso(true);
    } else {
      setBotonIngreso(false);
    }
  };

  const handleAgregarTelefono = () => {
    setTelefonos([...telefonos, '']);
  };

  const handleTelefonoChange = (index, value) => {
    const newTelefonos = [...telefonos];
    newTelefonos[index] = value;
    setTelefonos(newTelefonos);
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
              <input ref={nombre} type="text" className="form-control" placeholder="Nombre" required onChange={habilitarBoton} />
            </div>

            <div className="input-group form-group">
              <input ref={cedula} type="text" className="form-control" placeholder="Cédula" required onChange={habilitarBoton} />
            </div>

            <div className="input-group form-group" onChange={habilitarBoton}>
              <select ref={rol} className="form-control">
                <option value="">Seleccione su rol</option>
                <option value="normal">Normal</option>
                <option value="admin">Admin</option>
                <option value="chofer">Chofer</option>
              </select>
            </div>

            <div className="input-group form-group">
              <input ref={fechaDeIngreso} type="date" className="form-control" placeholder="Fecha de ingreso" required onChange={habilitarBoton} />
            </div>

            <div className="input-group form-group">
              <label>Teléfonos:</label>
              {telefonos.map((telefono, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control"
                  placeholder={`Teléfono ${index + 1}`}
                  value={telefono}
                  onChange={(e) => handleTelefonoChange(index, e.target.value)}
                />
              ))}
              <button type="button" className="btn btn-secondary" onClick={handleAgregarTelefono}>Agregar Teléfono</button>
            </div>

            <div className="text-center">
              <input id="crearEmpleado_btn" type="button" onClick={registrarEmpleado} disabled={!botonIngreso} value="Crear Empleado" className="btn btn-primary styled-button" />
            </div>

            <div>{error && <p className="text-danger">{error}</p>}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearEmpleados; */










/* import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom";
import { crearEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";

const CrearEmpleados = () => {
    const nombre = useRef(null);
    const cedula = useRef(null);
    const rol = useRef(null);
    const fechaDeIngreso = useRef(null);
    const [botonIngreso, setBotonIngreso] = useState(false);
    const [error, setError] = useState("");

    let navigate = useNavigate();
    const getToken = useAuth();

    useEffect(() => {
        const usuarioToken = getToken();
        if (!usuarioToken) {
            navigate("/");
        }
    }, [getToken, navigate]);

    // CON ESTA FUNCIÓN HAGO EL REGISTRO SEGÚN LOS DATOS BRINDADOS POR EL USUARIO
    const registrarEmpleado = async () => {
        const usuarioToken = getToken();

        const name = nombre.current.value;
        const ci = cedula.current.value;
        const r = rol.current.value;
        const fecha = fechaDeIngreso.current.value;

        try {
            const response = await crearEmpleado({
              nombre: name,
              cedula: ci,
              rol: r,
              fechaEntrada: fecha
            }, usuarioToken); // Asegúrate de que usuarioToken esté definido y sea válido
        
            const datos = response.data;
        
            if (datos.error) {
              console.error(datos.error);
              setError(datos.error);
            } else {
              console.log("Usuario creado correctamente", datos);
              // Redirigir o realizar otra acción aquí, si es necesario
            }
          } catch (error) {
            console.error('Error al conectar con el servidor:', error.response?.data || error.message);
            if (error.response?.status === 401) {
              navigate("/login");
            }
          }
    }

    const habilitarBoton = () => {
        let name = nombre.current.value;
        let ci = cedula.current.value;
        let r = rol.current.value;
        let fecha = fechaDeIngreso.current.value;

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
        if (fecha !== "") {
            val++;
        }

        if (val === 4) {
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

                        <div className="input-group form-group">
                            <input ref={fechaDeIngreso} type="date" className="form-control" placeholder="Fecha de ingreso" required onChange={habilitarBoton}/>
                        </div>

                        <div className="text-center">
                            <input id="crearEmpleado_btn" type="button" onClick={registrarEmpleado} disabled={!botonIngreso} value="Crear Empleado" className="btn btn-primary styled-button" />
                        </div>

                        <div>

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