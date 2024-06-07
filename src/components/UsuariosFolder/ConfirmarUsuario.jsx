// src/components/ConfirmarUsuario.js
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { confirmarUsuario } from '../../api';

const ConfirmarUsuario = () => {
  const navigate = useNavigate();
  const usuarioEmail = useRef(null);
  const [botonConfirmar, setBotonConfirmar] = useState(false);
  const usuarios = useSelector(state => state.usuarios.usuarios);
  const usuariosSinConfirmar = usuarios.filter(u => !u.activo);
  let usuarioToken = localStorage.getItem('apiToken');

  useEffect(() => {
    if (!localStorage.getItem('apiToken')) {
      navigate("/");
    }
  }, [navigate]);

  const confirmar = () => {
    const email = usuarioEmail.current.value;
  
    confirmarUsuario(email, usuarioToken)
      .then((response) => {
        const datos = response.data;
  
        if (datos.error) {
          console.error(datos.error);
        } else {
          console.log("Usuario confirmado correctamente", datos);
          // Realizar alguna acción adicional si es necesario
        }
      })
      .catch((error) => {
        console.error("Error al conectar con el servidor:", error);
      });
  };

  const habilitarBoton = () => {
    let email = usuarioEmail.current.value;
    let val = 0;

    if (email !== "") {
        val++;
    }
    if (val === 1) {
        setBotonConfirmar(true);
    } else {
        setBotonConfirmar(false);
    }
}; 

  return (
    <div className="d-flex justify-content-center h-100">
      <div className="card">
        <div className="card-header">
          <h3>Confirmar usuario</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="input-group form-group" onChange={habilitarBoton}>
              <select ref={usuarioEmail} name="slcUsuario" id="usuSlc" className="form-control">
                <option value="">Seleccione usuario</option>
                {usuariosSinConfirmar.map(usu => <option key={usu.id} value={usu.email}> {usu.email} </option>)}
              </select>
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-primary styled-button" onClick={confirmar} disabled={!botonConfirmar}>
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
