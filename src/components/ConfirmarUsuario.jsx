import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ConfirmarUsuario = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const usuarioEmail = useRef(null);
  const [botonConfirmar, setBotonConfirmar] = useState(false);
  const usuarios = useSelector(state => state.usuarios.usuarios);

  const [usuariosSinConfirmar, setUsuariosSinConfirmar] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('apiToken')) {
      navigate("/");
    } else {
      console.log("Usuarios:", usuarios); // Debugging line
      setUsuariosSinConfirmar(usuarios.filter(u => !u.activo));
    }
  }, [usuarios, navigate]);

    const confirmar = () => {
        let usu = usuarioEmail.current.value;

        fetch(`${apiUrl}usuarios/confirmar`, {
            method: "PUT",
            headers: {
                "authorization": usuarioToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: usu.email
            }),
        })
            .then((r) => r.json())
            .then((datos) => {
                console.log(datos);
                if (datos.error) {
                    console.error(datos.error);
                } else {
                    console.log("Usuario confirmado correctamente", datos);
                }
            })
            .catch((error) => {
                console.error("Error al conectar con el servidor:", error);
            }); 
    };

    return (

        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Confirmar usuario</h3>
                </div>
                <div className="card-body">
                    <form>

                    <div className="input-group form-group">
                            <select ref={usuarioEmail} name="slcUsuario" id="usuSlc" className="form-control" /* onChange={habilitarBoton} */>
                                <option value="">Seleccione usuario</option>
                                {usuariosSinConfirmar.map(usu => <option key={usu.id} value={usu.email}> {usu.email} </option>)}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <button type="button" className="btn btn-primary styled-button"  onClick={confirmar} disabled={!botonConfirmar}>
                                Confirmar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
    );
}

export default ConfirmarUsuario;