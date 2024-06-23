import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Singin from './components/Singin';
import Dashboard from './components/Dashboard';
import CustomNavbar from "./components/Navbar";
import CustomFooter from './components/Footer';
import CrearEmpleados from './components/EmpleadosFolder/CrearEmpleados';
import CrearCamiones from './components/CamionesFolder/CrearCamiones';
import ConfirmarUsuario from './components/UsuariosFolder/ConfirmarUsuario';
import Empleados from './components/EmpleadosFolder/Empleados';
import Jornales from './components/JornalesFolder/Jornales';
import Camiones from './components/CamionesFolder/Camiones';
import ListaJornales from './components/JornalesFolder/ListaJornales';
import AgregarTelefono from './components/AgregarTelefono';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css"
import HistorialCamiones from './components/CamionesFolder/HistorialCamiones';

const App = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // Aquí almacenarás el userRole después de la autenticación

  useEffect(() => {
      // Lógica para obtener el userRole después de la autenticación
      const storedUserRole = localStorage.getItem('userRol');
      setUserRole(storedUserRole);
  }, [navigate]);

  // Verifica si la ruta actual es la de login
  const isLoginPage = location.pathname === '/login';
  const isSinginPage = location.pathname === '/singin';

  return (
    <div>
      {!isLoginPage && !isSinginPage && <CustomNavbar userRole={userRole}/>}
      <div className='content'>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/singin" element={<Singin />} />
        {/* USUARIOS */}
        <Route path="/usuarios/confirmar" element={<ConfirmarUsuario />} />
        <Route path="/empleados/crear" element={<CrearEmpleados />} />
        <Route path="/empleados/telefonos" element={<AgregarTelefono />} />
        {/* EMPLEADOS */}
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/empleados/jornales" element={<Jornales />} />
       <Route path="/lj" element={<ListaJornales />} /> 
       {/* CAMIONES */}
       <Route path="/camiones" element={<Camiones />} /> 
       <Route path="/camiones/crear" element={<CrearCamiones />} /> 
       <Route path="/camiones/historial" element={<HistorialCamiones />} /> 

        {/* <Route path="/hc" element={<AsignarChofer />} />  */}
      /</Routes>
      </div>
      {!isLoginPage && !isSinginPage && <CustomFooter />}

    </div>
  );
}

export default App; 