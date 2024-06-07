// src/components/CrearCamiones.js
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import { useNavigate } from 'react-router-dom';
import { crearCamion } from '../../api'; // Importa la función crearCamion desde api.js

const CrearCamiones = () => {
    const matricula = useRef(null);
    const modelo = useRef(null);
    const anio = useRef(null);
    const estado = useRef(null);
    const [botonRegistro, setBotonRegistro] = useState(false);
    const navigate = useNavigate(); // Agrega useNavigate

    useEffect(() => {
        if (localStorage.getItem('apiKey') === null) {
            navigate("/");
        }
    }, [navigate]);

    const registrarCamion = async () => {
        let mat = matricula.current.value;
        let mod = modelo.current.value;
        let an = anio.current.value;
        let est = estado.current.value;

        try {
            const response = await crearCamion({ matricula: mat, modelo: mod, anio: an, estado: est });
            const datos = response.data;

            if (datos.error) {
                console.error(datos.error);
            } else {
                console.log("Camión creado correctamente", datos);
                // Realizar alguna acción adicional si es necesario
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
        }
    };

    const habilitarBoton = () => {
        let mat = matricula.current.value;
        let mod = modelo.current.value;
        let an = anio.current.value;
        let est = estado.current.value;
        let valor = 0;

        if (mat !== "") {
            valor++;
        }
        if (mod !== "") {
            valor++;
        }
        if (an !== "") {
            valor++;
        }
        if (est !== "") {
            valor++;
        }
        if (valor === 4) {
            setBotonRegistro(true);
        } else {
            setBotonRegistro(false);
        }
    };

    return (
        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Registrar camión</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="input-group form-group">
                            <input type="text" className="form-control" placeholder="Matrícula" ref={matricula} onChange={habilitarBoton} />
                        </div>
                        <div className="input-group form-group">
                            <input type="text" className="form-control" placeholder="Modelo" ref={modelo} onChange={habilitarBoton} />
                        </div>
                        <div className="input-group form-group">
                            <input type="text" className="form-control" placeholder="Año" ref={anio} onChange={habilitarBoton} />
                        </div>
                        <div className="input-group form-group">
                            <input type="text" className="form-control" placeholder="Estado" ref={estado} onChange={habilitarBoton} />
                        </div>
                        <div className="form-group text-center">
                            <button type="button" id="crearCamion_btn" className="btn btn-primary styled-button" onClick={registrarCamion} disabled={!botonRegistro}>Registrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearCamiones;
