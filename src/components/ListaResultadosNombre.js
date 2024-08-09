import React from 'react';
import { Table, Button } from 'react-bootstrap';
import '../assets/css/ListaResultadosNombre.css';

const ListaResultadosNombre = ({ resultados, onSeleccionar }) => {
  return (
    <>
      {/* Vista para pantallas grandes */}
      <div className="d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultados.length === 0 ? (
              <tr>
                <td colSpan="2">No se encontraron resultados.</td>
              </tr>
            ) : (
              resultados.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => onSeleccionar(item.id, item.nombre)}
                    >
                      Seleccionar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Vista para pantallas pequeñas */}
      <div className="d-md-none">
        {resultados.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          resultados.map((item) => (
            <div key={item.id} className="resultado-item mb-3">
              <div className="nombre">{item.nombre}</div>
              <Button
                variant="primary"
                onClick={() => onSeleccionar(item.id, item.nombre)}
                className="mt-2"
              >
                Seleccionar
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ListaResultadosNombre;

