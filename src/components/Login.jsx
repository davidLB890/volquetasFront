import { useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
    const email = useRef(null);
    const password = useRef(null);
    const [botonIngreso, setBotonIngreso] = useState(false);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    //Se ingresa según los datos brindados por el usuario
    const Ingresar = () => {
        let em = email.current.value;
        let contra = password.current.value;

        fetch("http://localhost:3000/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                email: em,
                password: contra
            })
        }).then(r => r.json())
        .then(datos => {
            if (datos.error) {
                console.log(datos.error);
                setError(datos.error);
            } else { 
                console.log(datos);
                let token = datos.token;
                localStorage.setItem('apiToken', token);
                //localStorage.setItem('id', datos.id);
                console.log(localStorage.getItem('apiToken'));
                navigate("/dashboard");
            }
        });
    }; 

    //con esto habilito el botón de ingreso si los campos no están vacíos
    const habilitarBoton = () => {
        let usuario = email.current.value;
        let contra = password.current.value;
        let val = 0;
        if (usuario !== "") {
            val++;
        }
        if (contra !== "") {
            val++;
        }
        if (val === 2) {
            setBotonIngreso(true);
        } else {
            setBotonIngreso(false);
        }
    }; 

    return (
        <div className="d-flex justify-content-center">
            <div className="card">
                <div className="card-header text-center">
                    <h3>Inicia sesión</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <input ref={email} type="text" className="form-control" placeholder="username" onChange={habilitarBoton} />
                        </div>

                        <div className="input-group form-group">
                            <input ref={password} type="password" className="form-control" placeholder="password" onChange={habilitarBoton} />
                        </div>
                        
                        <div className="text-center">
                            <input id="l_btn" type="button" onClick={Ingresar} disabled={!botonIngreso} value="Login" className="btn btn-primary styled-button" />
                        </div>
                    </form>

                    
                </div>
                <div className="card-footer text-center">
                    {/* <div className="d-flex justify-content-center links">
                        Presiona <Link to="/singin">aquí </Link> para registrarte 
                    </div> */}
                    <span>{error}</span>
                </div>
            </div>
        </div>
    );
};

export default Login;


/* const Login = () => {

    const user = useRef(null);
    const password = useRef(null);
    const [botonIngreso, setBotonIngreso] = useState(false)
    const [error, setError] = useState("")
    let navigate = useNavigate();

    const Ingresar = () => {
        let usuario = (user.current.value);
        let contra = (password.current.value); */

        /* fetch("https://crypto.develotion.com/login.php", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"//,
            },
            body: JSON.stringify({ 
                "usuario":usuario,
                "password":contra
            })
        }).then(r => r.json())
        .then(datos =>{
             if(datos.codigo === 409){
                console.log(datos.error);
                setError(datos.mensaje)
            }
            else{ 
                console.log(datos);
                let key = datos.apiKey;
                localStorage.setItem('apiKey', key);
                localStorage.setItem('id', datos.id);
                //console.log(key);
                navigate("/dashboard")
                //key = localStorage.getItem('apiKey');
            } 
        })*/
  /*   } 

     const habilitarBoton = () => {
        let usuario = (user.current.value);
        let contra = (password.current.value);
        let val = 0;
        if(usuario !== ""){
            val++;
        }
        if(contra !== ""){
            val++
        }
        if(val === 2){
            setBotonIngreso(true)
        }
        else{
            setBotonIngreso(false)
        }
    } 

    return (

        <div className="d-flex justify-content-center">
            <div className="card">
                <div className="card-header">
                    <h3>Sign In</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">

                            <input ref={user} type="text" className="form-control" placeholder="username" onChange={habilitarBoton} />

                        </div>

                        <div className="input-group form-group">
                            <input ref={password} type="password" className="form-control" placeholder="password" onChange={habilitarBoton} />
                        </div>


                            <input id="login_btn" type="button" onClick={Ingresar} disabled={!botonIngreso} value="Login" className="btn float-right login_btn" />

                    </form>
                </div>
                <div classNameName="card-footer">
                    <div className="d-flex justify-content-center links">
                        Don't have an account?<Link to="/registro">Registrarme</Link>
                    </div>
                    <span>{error}</span>
                </div>
            </div>
        </div>

)

} */

//export default Login