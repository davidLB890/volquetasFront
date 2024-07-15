import React, { useEffect, useState } from 'react';
import { Form, Spinner, Alert } from 'react-bootstrap';
import { getPermisoIdEmpresa } from '../../api';
import useAuth from '../../hooks/useAuth';

const SelectPermiso = ({ empresaId, onSelect }) => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getToken = useAuth();

  useEffect(() => {
    const fetchPermisos = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getPermisoIdEmpresa(empresaId, 'si', usuarioToken);
        setPermisos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los permisos:", error.response?.data?.error || error.message);
        setError("Error al obtener los permisos");
        setLoading(false);
      }
    };

    fetchPermisos();
  }, [empresaId, getToken]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Form.Group controlId="selectPermiso">
      <Form.Label>Seleccionar Permiso</Form.Label>
      <Form.Control as="select" onChange={(e) => onSelect(e.target.value)}>
        <option value="">Seleccione un permiso</option>
        {permisos.map((permiso) => (
          <option key={permiso.id} value={permiso.id}>
            ID: {permiso.id} - Vence: {new Date(permiso.fechaVencimiento).toLocaleDateString()}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default SelectPermiso;
