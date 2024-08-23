import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    'empleados': 'Empleados',
    'jornales': 'Jornales',
    'camiones': 'Camiones',
    'historial': 'Historial',
    'clientes': 'Clientes',
    'usuarios': 'Usuarios',
    'confirmar': 'Confirmar',
    'obras': 'Obras',
    'crear': 'Crear',
    'empresas': 'Empresas',
    'particulares': 'Particulares',
    'datos': 'Datos',
    'pedidos': 'Pedidos',
    'volquetas': 'Volquetas',
    'facturas': 'Facturas',
    'permisos': 'Permisos',
    'imm': 'IMM',
    'estadisticas': 'Estadisticas',
    "reporteChofer": "Reportes de Chofer",
    "cajas": "Caja",
    "cambiar-contrasena-admin": "Cambiar Contraseñas",
    "estadisticasdeudores": "Estadisticas Deudores",
    "estadisticaspedidos": "Estadisticas Pedidos",
    "estadisticascliente": "Estadisticas Cliente",
  };

  const handleClick = (to) => {
    if (to === '/pedidos') {
      navigate('/');
    } else {
      navigate(to);
    }
  };

  return (
    <Breadcrumb>
      {pathnames.length === 0 ? (
        <Breadcrumb.Item active>Inicio</Breadcrumb.Item>
      ) : (
        pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return isLast ? (
            <Breadcrumb.Item active key={to}>{breadcrumbNameMap[value]}</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
              key={to}
              linkAs={Link}
              linkProps={{ to }}
              onClick={(e) => {
                e.preventDefault();
                handleClick(to);
              }}
            >
              {breadcrumbNameMap[value]}
            </Breadcrumb.Item>
          );
        })
      )}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
