import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Container, Form } from 'react-bootstrap';
import { getPermisos, getEmpresaId, getParticularId } from '../../api'; // Asegúrate de ajustar las rutas según sea necesario
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const ListaPermisosGeneral = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fechaVencimiento', direction: 'asc' });
  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermisos = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getPermisos(usuarioToken);
        const permisosConNombre = await fetchClientes(response.data, usuarioToken);
        setPermisos(permisosConNombre);
      } catch (error) {
        setError('Error al obtener los permisos');
      }
      setLoading(false);
    };

    fetchPermisos();
  }, [getToken]);

  const fetchClientes = async (permisos, usuarioToken) => {
    return Promise.all(
      permisos.map(async (permiso) => {
        if (permiso.empresaId) {
          const empresaResponse = await getEmpresaId(permiso.empresaId, usuarioToken);
          return { ...permiso, nombreCliente: empresaResponse.data.nombre, tipoCliente: 'empresa' };
        } else if (permiso.particularId) {
          const particularResponse = await getParticularId(permiso.particularId, usuarioToken);
          return { ...permiso, nombreCliente: particularResponse.data.nombre, tipoCliente: 'particular' };
        }
        return { ...permiso, nombreCliente: 'Desconocido', tipoCliente: '' };
      })
    );
  };

  const sortedPermisos = permisos.sort((a, b) => {
    if (sortConfig.key === 'nombreCliente') {
      if (a.nombreCliente < b.nombreCliente) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a.nombreCliente > b.nombreCliente) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    } else {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
  });

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({ key, direction });
  };

  const handleClienteClick = (permiso) => {
    if (permiso.tipoCliente === 'empresa') {
      navigate(`/empresas/datos`, { state: { empresaId: permiso.empresaId } });
    } else if (permiso.tipoCliente === 'particular') {
      navigate(`/particulares/datos`, { state: { particularId: permiso.particularId } });
    }
  };

  const getCellStyle = (fechaVencimiento) => {
    const now = moment();
    const vencimiento = moment(fechaVencimiento);
    if (vencimiento.isBefore(now, 'day')) {
      return { backgroundColor: 'red', color: 'white' };
    } else if (vencimiento.isSame(now, 'month')) {
      return { backgroundColor: 'yellow' };
    }
    return {};
  };

  return (
    <Container>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <Form.Group controlId="sortSelect" className="mb-3">
            <Form.Label>Ordenar por:</Form.Label>
            <Form.Control as="select" onChange={handleSortChange}>
              <option value="fechaVencimiento-asc">Fecha de Vencimiento (Ascendente)</option>
              <option value="fechaVencimiento-desc">Fecha de Vencimiento (Descendente)</option>
              <option value="nombreCliente-asc">Cliente (Ascendente)</option>
              <option value="nombreCliente-desc">Cliente (Descendente)</option>
            </Form.Control>
          </Form.Group>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha Creación</th>
                <th>Fecha Vencimiento</th>
                <th>Cliente</th>
              </tr>
            </thead>
            <tbody>
              {sortedPermisos.map((permiso) => (
                <tr key={permiso.id}>
                  <td>{permiso.id}</td>
                  <td>{moment(permiso.fechaCreacion).format('YYYY-MM-DD')}</td>
                  <td style={getCellStyle(permiso.fechaVencimiento)}>{moment(permiso.fechaVencimiento).format('YYYY-MM-DD')}</td>
                  <td
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => handleClienteClick(permiso)}
                  >
                    {permiso.nombreCliente || 'Desconocido'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default ListaPermisosGeneral;
