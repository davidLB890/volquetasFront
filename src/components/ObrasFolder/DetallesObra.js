// src/components/ObrasFolder/DatosObraGeneral.js
import React from "react";
import { Card, Button } from "react-bootstrap";

const DetallesObra = ({ obra, setShowModificarObra }) => {
  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>{obra.calle}</Card.Title>
        <Card.Text>
          <strong>Calle:</strong> {obra.calle}
        </Card.Text>
        <Card.Text>
          <strong>Esquina:</strong> {obra.esquina}
        </Card.Text>
        <Card.Text>
          <strong>Barrio:</strong> {obra.barrio}
        </Card.Text>
        <Card.Text>
          <strong>Coordenadas:</strong> {obra.coordenadas}
        </Card.Text>
        <Card.Text>
          <strong>Número de Puerta:</strong> {obra.numeroPuerta}
        </Card.Text>
        <Card.Text>
          <strong>Descripción:</strong> {obra.descripcion}
        </Card.Text>
        <Card.Text>
          <strong>Activa:</strong> {obra.activa ? "Sí" : "No"}
        </Card.Text>
        {obra.ObraDetalle && (
          <>
            <Card.Text>
              <strong>Detalle de Residuos:</strong> {obra.ObraDetalle.detalleResiduos}
            </Card.Text>
            <Card.Text>
              <strong>Residuos Mezclados:</strong> {obra.ObraDetalle.residuosMezclados ? "Sí" : "No"}
            </Card.Text>
            <Card.Text>
              <strong>Residuos Reciclados:</strong> {obra.ObraDetalle.residuosReciclados ? "Sí" : "No"}
            </Card.Text>
            <Card.Text>
              <strong>Frecuencia Semanal:</strong> {obra.ObraDetalle.frecuenciaSemanal.map((dia, index) => (
                <span key={index}>
                  {dia.value}
                  {dia.inclusive ? "(Inclusive)" : ""}
                  {index < obra.ObraDetalle.frecuenciaSemanal.length - 1 ? ", " : ""}
                </span>
              ))}
            </Card.Text>
            <Card.Text>
              <strong>Destino Final:</strong> {obra.ObraDetalle.destinoFinal}
            </Card.Text>
            <Card.Text>
              <strong>Días:</strong> {obra.ObraDetalle.dias}
            </Card.Text>
          </>
        )}
        <Button
          variant="warning"
          className="ml-2"
          onClick={() => setShowModificarObra(true)}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
          }}
        >
          Modificar Obra
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DetallesObra;
