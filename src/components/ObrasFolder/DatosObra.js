import React, { useEffect, useState } from "react";
import { getObraId, getEmpresaId } from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import { Container, Card, Spinner, Alert, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SeleccionarOAgregarContacto from "../EmpresasFolder/SeleccionarOAgregarContacto"; // Ajusta la ruta según sea necesario

const DatosObra = ({ obraId }) => {
  const [obra, setObra] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);
  const [error, setError] = useState("");
  const [showSeleccionarContacto, setShowSeleccionarContacto] = useState(false);

  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObra = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getObraId(obraId, usuarioToken);
        setObra(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la obra:", error.response?.data?.error || error.message);
        setError("Error al obtener la obra");
        setLoading(false);
      }
    };

    fetchObra();
  }, [obraId, getToken]);

  const fetchEmpresa = async (empresaId) => {
    const usuarioToken = getToken();
    setLoadingEmpresa(true);
    try {
      const response = await getEmpresaId(empresaId, usuarioToken);
      setEmpresa(response.data);
    } catch (error) {
      console.error("Error al obtener la empresa:", error.response?.data?.error || error.message);
      setError("Error al obtener la empresa");
    } finally {
      setLoadingEmpresa(false);
    }
  };

  const handleNavigateToEmpresa = () => {
    navigate("/empresas/datos", { state: { empresaId: obra.empresaId } });
  };

  const handleSeleccionarContacto = () => {
    if (obra.empresaId) {
      fetchEmpresa(obra.empresaId);
      setShowSeleccionarContacto(true);
    } else {
      setError("No hay empresa asociada a esta obra.");
    }
  };

  const handleContactoSeleccionado = (contacto) => {
    console.log("Contacto seleccionado/agregado:", contacto);
    setShowSeleccionarContacto(false);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>Datos de la Obra</Card.Header>
        <Card.Body>
          <Card.Text><strong>Calle:</strong> {obra.calle}</Card.Text>
          <Card.Text><strong>Esquina:</strong> {obra.esquina}</Card.Text>
          <Card.Text><strong>Barrio:</strong> {obra.barrio}</Card.Text>
          <Card.Text><strong>Coordenadas:</strong> {obra.coordenadas}</Card.Text>
          <Card.Text><strong>Número de Puerta:</strong> {obra.numeroPuerta}</Card.Text>
          <Card.Text><strong>Descripción:</strong> {obra.descripcion}</Card.Text>
          <Card.Text><strong>Activa:</strong> {obra.activa ? "Sí" : "No"}</Card.Text>
          {obra.empresa && (
            <>
              <Button variant="link" onClick={handleNavigateToEmpresa}>
                {obra.empresa.nombre}
              </Button>
              <Button
                variant="primary"
                className="ml-2"
                onClick={handleSeleccionarContacto}
              >
                Seleccionar o Agregar Contacto
              </Button>
            </>
          )}
          {obra.ObraDetalle && (
            <>
              <Card.Text><strong>Detalle de Residuos:</strong> {obra.ObraDetalle.detalleResiduos}</Card.Text>
              <Card.Text><strong>Residuos Mezclados:</strong> {obra.ObraDetalle.residuosMezclados ? "Sí" : "No"}</Card.Text>
              <Card.Text><strong>Residuos Reciclados:</strong> {obra.ObraDetalle.residuosReciclados ? "Sí" : "No"}</Card.Text>
              <Card.Text><strong>Frecuencia Semanal:</strong> {obra.ObraDetalle.frecuenciaSemanal.map((dia, index) => (
                <span key={index}>
                  {dia.value}{dia.inclusive ? "(Inclusive)" : ""}{index < obra.ObraDetalle.frecuenciaSemanal.length - 1 ? ", " : ""}
                </span>
              ))}</Card.Text>
              <Card.Text><strong>Destino Final:</strong> {obra.ObraDetalle.destinoFinal}</Card.Text>
              <Card.Text><strong>Días:</strong> {obra.ObraDetalle.dias}</Card.Text>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showSeleccionarContacto} onHide={() => setShowSeleccionarContacto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar o Agregar Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingEmpresa ? (
            <Spinner animation="border" />
          ) : (
            empresa && (
              <SeleccionarOAgregarContacto
                empresa={empresa}
                onContactoSeleccionado={handleContactoSeleccionado}
              />
            )
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DatosObra;


//ya tengo la empresa acá mismo, si lo quiero mandar a los datos de la empresa en vez de que lo busque ahí, ya debería pasarle la empresa