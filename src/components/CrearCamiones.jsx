import { useEffect } from "react"
import { useRef } from "react";
import { useState } from "react";

const CrearCamiones = () => {
    const matricula = useRef(null);
    const modelo = useRef(null);
    const anio = useRef(null);
    const estado = useRef(null);
    const [botonRegistro, setBotonRegistro] = useState(false);


    useEffect(() => {
        if (localStorage.getItem('apiKey') === null) {
          navigate("/");
        }
    }, []);

    const registrarCamion = () => {
        let mat = matricula.current.value;
        let mod = modelo.current.value;
        let an = anio.current.value;
        let est = estado.current.value;

        fetch("http://localhost:3000/api/camiones", {
            method:"POST",
            headers:{
            "authorization": localStorage.getItem('apiKey'),
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            matricula: mat,
            modelo: mod,
            anio: an,
            estado: est,
        })
        }).then(r => r.json())
        .then(datos =>{
        console.log(datos);
        if(datos.error){
          console.error(datos.error);
        } else {
          console.log("Camión creado correctamente", datos);
        }
    })}

    const habilitarBoton = () => {
        let mat = matricula.current.value;
        let mod = modelo.current.value;
        let an = anio.current.value;
        let est = estado.current.value;
        let valor = 0;

        if(mat !== ""){
            valor++;
        }
        if(mod !== ""){
            valor++;
        }
        if(an !== ""){
            valor++;
        }
        if(est !== ""){
            valor++;
        }
        if(valor === 4){
            setBotonRegistro(true);
        } else {
            setBotonRegistro(false);
        }
    }

    return (
        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Registrar camión</h3>
                </div>
                <div className="card-body">
                    <form>

                    <div className="input-group form-group">
                        <input type="text" className="form-control" placeholder="Matrícula" ref={matricula} onChange={habilitarBoton}/>
                    </div>

                    <div className="input-group form-group">
                        <input type="text" className="form-control" placeholder="Modelo" ref={modelo} onChange={habilitarBoton}/>
                    </div>

                    <div className="input-group form-group">
                        <input type="text" className="form-control" placeholder="Año" ref={anio} onChange={habilitarBoton}/>
                    </div>

                    <div className="input-group form-group">
                        <input type="text" className="form-control" placeholder="Estado" ref={estado} onChange={habilitarBoton}/>
                    </div>

                    <div className="form-group text-center">
                        <button type="button" id="crearCamion_btn" className="btn btn-primary styled-button" onClick={registrarCamion} disabled={!botonRegistro}>Registrar</button>
                    </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CrearCamiones;