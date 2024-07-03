import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/UsuariosFolder/Login';
import Singin from './components/UsuariosFolder/Singin';
import Dashboard from './components/Dashboard';
import CustomSidebar from './components/SideNav';
import CustomNavbar from './components/NavBarr';
import CrearEmpleados from './components/EmpleadosFolder/CrearEmpleados';
import CrearCamiones from './components/CamionesFolder/CrearCamiones';
import ConfirmarUsuario from './components/UsuariosFolder/ConfirmarUsuario';
import Empleados from './components/EmpleadosFolder/Empleados';
import Jornales from './components/JornalesFolder/Jornales';
import Camiones from './components/CamionesFolder/Camiones';
import ListaJornalesDatos from './components/JornalesFolder/ListaJornalesDatos';
import AgregarTelefono from './components/TelefonosFolder/AgregarTelefono';
import 'bootstrap/dist/css/bootstrap.min.css';
//import "./styles/global.css";
import HistorialCamiones from './components/CamionesFolder/HistorialCamiones';
import CrearClientes from './components/ClientesFolder/AgregarCliente';
import Clientes from './components/ClientesFolder/Clientes';
import './assets/css/app.css';
import 'moment/locale/es';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // Aquí almacenarás el userRole después de la autenticación

  useEffect(() => {
    // Lógica para obtener el userRole después de la autenticación
    // moment.locale('es');
    const storedUserRole = localStorage.getItem('userRol');
    setUserRole(storedUserRole);
  }, [navigate]);

  // Verifica si la ruta actual es la de login
  const isLoginPage = location.pathname === '/login';
  const isSinginPage = location.pathname === '/singin';

  return (
    <div className="app-container">
      {!isLoginPage && !isSinginPage && <CustomNavbar userRole={userRole} />}
      {!isLoginPage && !isSinginPage && <CustomSidebar userRole={userRole} />}
      <div className="content">
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
          <Route path="/lj" element={<ListaJornalesDatos />} />
          {/* CAMIONES */}
          <Route path="/camiones" element={<Camiones />} />
          <Route path="/camiones/crear" element={<CrearCamiones />} />
          <Route path="/camiones/historial" element={<HistorialCamiones />} />
          {/* CLIENTES */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/crear" element={<CrearClientes />} />
          {/* <Route path="/hc" element={<AsignarChofer />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
