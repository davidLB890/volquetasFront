import React, { useEffect, useState } from 'react';
import { useNavigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './components/UsuariosFolder/Login';
import Singin from './components/UsuariosFolder/Singin';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
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
import HistorialCamiones from './components/CamionesFolder/HistorialCamiones';
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
import Volquetas from './components/VolquetasFolder/Volquetas';
import AgregarVolqueta from './components/VolquetasFolder/AgregarVolqueta';
import DatosVolqueta from './components/VolquetasFolder/DatosVolqueta';
import DatosPedido from './components/PedidosFolder/DatosPedido';
import NotFound from './components/NotFound';
import Facturas from './components/FacturasFolder/Facturas';
import AgregarFactura from './components/FacturasFolder/AgregarFactura';
import DatosFactura from './components/FacturasFolder/DatosFactura';
import ListaPermisosGeneral from './components/PermisosFolder/ListaPermisosGeneral';
import ListaIMM from './components/ObrasFolder/ListaIMM';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const dispatch = useDispatch();
  const getToken = useAuth();

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRol');
    setUserRole(storedUserRole);
  }, [navigate]);

  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken) {
      dispatch(fetchEmpleados(usuarioToken));
      dispatch(fetchCamiones(usuarioToken));
    }
  }, [dispatch, getToken, location.pathname]);

  const isLoginPage = location.pathname === '/login';
  const isSinginPage = location.pathname === '/singin';
  const isNotFoundPage = !['/', '/login', '/singin', '/usuarios/confirmar', 
    '/empleados/crear', '/empleados/telefonos', '/empleados', '/empleados/jornales', 
    '/lj', '/camiones', '/camiones/crear', '/camiones/historial', '/obras', 
    '/obras/crear', '/empresas', '/empresas/datos', '/empresas/crear', '/particulares', 
    '/particulares/datos', '/particulares/crear', '/pedidos/crear', '/pedidos/datos', 
    '/volquetas', '/volquetas/crear', '/volquetas/datos', '/facturas', '/facturas/crear',
    '/facturas/datos', '/permisos', '/imm'].includes(location.pathname);

  const showSidebarAndNavbar = !isLoginPage && !isSinginPage && !isNotFoundPage;

  return (
    <div className={`app-container ${isNotFoundPage || isLoginPage || isSinginPage ? 'login-page' : 'with-sidebar'}`}>
      {showSidebarAndNavbar && <Navigation userRole={userRole} />}
      <div className="main-content">
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
            <Route path="/pedidos/datos" element={<DatosPedido />} />
            {/* VOLQUETAS */}
            <Route path="/volquetas" element={<Volquetas />} />
            <Route path="/volquetas/crear" element={<AgregarVolqueta />} />
            <Route path="/volquetas/datos" element={<DatosVolqueta />} />
            {/* FACTURAS */}
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/facturas/crear" element={<AgregarFactura />} />
            <Route path="/facturas/datos" element={<DatosFactura />} />
            {/* PERMISOS */}
            <Route path="/permisos" element={<ListaPermisosGeneral />} />
            <Route path="/imm" element={<ListaIMM />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;