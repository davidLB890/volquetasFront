import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    'empleados': 'Empleados',
    'jornales': 'Jornales',
    'camiones': 'Camiones',
    'historial': 'Historial Camiones',
    'clientes': 'Clientes',
    'usuarios': 'Usuarios',
    'confirmar': 'Confirmar',

    // Agrega más rutas según sea necesario
  };

  return (
    <Breadcrumb>
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `${pathnames.slice(0, index + 1).join('/')}`;

        return isLast ? (
          <Breadcrumb.Item active key={to}>{breadcrumbNameMap[value]}</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item as={Link} to={to} key={to}>
            {breadcrumbNameMap[value]}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
