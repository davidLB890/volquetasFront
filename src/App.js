import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './components/UsuariosFolder/Login';
import Singin from './components/UsuariosFolder/Singin';
import Dashboard from './components/Dashboard';
import CustomSidebar from './components/SideNav';
import CustomNavbar from './components/NavBarr';
import AgregarEmpleado from './components/EmpleadosFolder/AgregarEmpleado';
import AgregarCamion from './components/CamionesFolder/AgregarCamion';
import AgregarObra from './components/ObrasFolder/AgregarObra';
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
import Obras from './components/ObrasFolder/Obras';
import DatosEmpresa from './components/EmpresasFolder/DatosEmpresa';
import './assets/css/app.css';
import 'moment/locale/es';
import Empresas from './components/EmpresasFolder/Empresas';
import Particulares from './components/ParticularesFolder/Particulares';
import DatosParticulares from './components/ParticularesFolder/DatosParticulares';
import AgregarEmpresa from './components/EmpresasFolder/AgegarEmpresa';
import AgregarParticular from './components/ParticularesFolder/AgregarParticular';
import AgregarPedido from './components/PedidosFolder/AgregarPedido';
import useAuth from './hooks/useAuth';
import { fetchEmpleados } from './features/empleadosSlice';
import { fetchCamiones } from './features/camionesSlice';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const dispatch = useDispatch();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken) {
      dispatch(fetchEmpleados(usuarioToken));
      dispatch(fetchCamiones(usuarioToken));
    }
  }, [dispatch, getToken]);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRol');
    setUserRole(storedUserRole);
  }, [navigate]);

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
          <Route path="/empleados/crear" element={<AgregarEmpleado />} />
          <Route path="/empleados/telefonos" element={<AgregarTelefono />} />
          {/* EMPLEADOS */}
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/empleados/jornales" element={<Jornales />} />
          <Route path="/lj" element={<ListaJornalesDatos />} />
          {/* CAMIONES */}
          <Route path="/camiones" element={<Camiones />} />
          <Route path="/camiones/crear" element={<AgregarCamion />} />
          <Route path="/camiones/historial" element={<HistorialCamiones />} />
          {/* CLIENTES */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/crear" element={<CrearClientes />} />
          {/* OBRAS */}
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/crear" element={<AgregarObra />} />
          {/* EMPRESAS */}
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresas/datos" element={<DatosEmpresa />} />
          <Route path="/empresas/crear" element={<AgregarEmpresa />} />
          {/* PARTICULARES */}
          <Route path="/particulares" element={<Particulares />} />
          <Route path="/particulares/datos" element={<DatosParticulares />} />
          <Route path="/particulares/crear" element={<AgregarParticular />} />
          {/* PEDIDOS */}
          <Route path="/pedidos/crear" element={<AgregarPedido />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
