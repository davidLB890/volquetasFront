import Login from './components/Login';
//import Singin from './components/Singin';
import Dashboard from './components/Dashboard';
import { useRef } from 'react'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import CrearEmpleados from './components/EmpleadosFolder/CrearEmpleados';
import CrearCamiones from './components/CamionesFolder/CrearCamiones';
import ConfirmarUsuario from './components/UsuariosFolder/ConfirmarUsuario';
import CrearUsuarios from './components/UsuariosFolder/CrearUsuarios';
import Empleados from './components/EmpleadosFolder/Empleados';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  return (

     <BrowserRouter>
        <Routes>  
          {<Route path="/" element={<Dashboard/>}/>}
          {<Route path="/login" element={<Login/>}/>}
          {<Route path="/usuarios" element={<CrearUsuarios/>}/> }
          {<Route path="/usuarios/confirmar" element={<ConfirmarUsuario/>}/> }
          {<Route path="/empleados" element={<CrearEmpleados/>}/> }
          {<Route path="/empleadosssss" element={<Empleados/>}/> }
          {<Route path="/camiones" element={<CrearCamiones/>}/> }
          {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
          {/* <Route path="*" element={<NotFound/>}/> */}
          {/* <Route path="/" element={<Login/>}/> */}
        </Routes>
     </BrowserRouter>

  );
}

export default App;

/* function App() {

  const { data, loading, error, handleAbortRequest } = useFetch('http://localhost:3000/api/volquetas')
  const nroVolque = useRef(null);
  const ubi = useRef(null);

  const crearVolqueta =  () => {
    let nroVol = nroVolque.current.value;
    let ubiActual = ubi.current.value;
    fetch('http://localhost:3000/api/volquetas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nroVolqueta: nroVol,
        ubiActual: ubiActual,
      })
    })
  }

  return (
    <div className='App'>
      <h1>Vite + React</h1>
       <div className='card'>
          <ul>
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {data?.map((volqueta) => (
              <li key={volqueta.id}>{volqueta.nroVolqueta}{" "+ volqueta.ubiActual}</li>
            ))}
          </ul>
          <ul>
            <input ref={nroVolque} type="string" placeholder="Ingrese numero"></input>
            <input ref={ubi} type="string" placeholder="Ingrese ubicación"></input>
          </ul>
          <ul>
            <button onClick={crearVolqueta}>Crear volqueta</button>
          </ul>

      </div> 
    </div>
  )
} */

