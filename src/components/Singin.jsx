import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Singin = () => {

    const nombre = useRef(null);
    const rol = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const password2 = useRef(null);
    const activo = useRef(null);
    const telefono = useRef(null);
    const [telefonos, setTelefonos] = useState([]);
    const [botonIngreso, setBotonIngreso] = useState(false);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    //CON ESTA FUNCIÓN HAGO EL REGISTRO SEGÚN LOS DATOS BRINDADOS POR EL USUARIO
    const registroUsu = () => {
        let nom = (nombre.current.value);
        let r = (rol.current.value);
        let em = (email.current.value);
        let contra = (password.current.value);
        let contra2 = (password2.current.value);

        fetch("http://localhost:3000/api/usuarios", {
            method:"POST",
            headers:{
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            nombre: nom,
            rol: r,
            email: em,
            telefonos: telefonos,
            password: contra,
            confirmPassword: contra2 // Corregido aquí
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

    useEffect(() => {
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
    };

    const habilitarBoton = () => {
        let nom = nombre.current.value;
        let contra = password.current.value;
        let contra2 = password2.current.value;
        let r = rol.current.value;
        let em = email.current.value;
        let val = 0;
          if (nom !== "") {
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
        if (telefonos.length > 0) {
            val++;
        } 
        if (val === 6) {
            setBotonIngreso(true);
        } else {
            setBotonIngreso(false);
        }
    }; 

    return (

        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Register</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <input ref={nombre} type="text" className="form-control" placeholder="Nombre" required onChange={habilitarBoton}/>
                        </div>

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
                            <input ref={password2} type="password" className="form-control" placeholder="Confirm password" onChange={habilitarBoton} />
                        </div>
                        
                        <div className="input-group form-group">
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
                        </ul>

                        <input id="login_btn" type="button" onClick={registroUsu} disabled={!botonIngreso} value="Registrarse" className="btn float-right login_btn" />

                    </form>
                </div>

                <div className="card-footer">

                    <div className="d-flex justify-content-center links">
                        ¿Ya tenés una cuenta?<Link to="/">Ingresar</Link>
                    </div>

                </div>
            </div>
        </div>

    )

}

export default Singin