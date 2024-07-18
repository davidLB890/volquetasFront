import React from 'react';
import { Table, Button } from 'react-bootstrap';

const BusquedaParaCrear = ({ resultados, onSeleccionar }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {resultados.length === 0 ? (
          <tr>
            <td colSpan="3">No se encontraron resultados.</td>
          </tr>
        ) : (
          resultados.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => onSeleccionar(item)}
                >
                  Seleccionar
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default BusquedaParaCrear;