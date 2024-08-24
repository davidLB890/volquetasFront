import React, { useEffect, useState } from "react";
import { Spinner, Alert, Collapse, Card } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { volquetasVencidas } from "../../api";

const ListaVolquetasViaPublica = () => {
  const [volquetas, setVolquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLista, setShowLista] = useState(false);
  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolquetasVencidas = async () => {
      const usuarioToken = getToken();
      try {
        const response = await volquetasVencidas(usuarioToken);
        setVolquetas(response.data);
      } catch (err) {
        setError("Error al cargar las volquetas vencidas");
      } finally {
        setLoading(false);
      }
    };

    fetchVolquetasVencidas();
  }, [getToken]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const handleNavigateToPedido = (idPedido) => {
    navigate("/pedidos/datos", { state: { pedidoId: idPedido } });
  };

  return (
    <div>
      {/* Pestaña flotante */}
      <div
        className="pestaña-flotante"
        style={{
          position: "fixed",
          bottom: showLista ? "300px" : "0",
          right: "20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          padding: "10px",
          borderRadius: "10px 10px 0 0",
          cursor: "pointer",
          transition: "bottom 0.3s",
          zIndex: 1050,
          fontSize: "1rem", // Ajusta el tamaño del texto
        }}
        onClick={() => setShowLista(!showLista)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className={`bi bi-arrow-${showLista ? "down" : "up"}`}></i>
          <p style={{ margin: 0, marginLeft: "0.5rem" }}>Pedidos en Vía Pública {volquetas.length}</p>
        </div>
      </div>

      {/* Contenedor deslizante */}
      <Collapse in={showLista}>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            width: showLista && window.innerWidth <= 768 ? "95%" : "35%", // Cambiar a 95% para pantallas pequeñas
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #dee2e6",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
            padding: "5px 10px", // Reducir padding para más espacio
          }}
          className="lista-volquetas"
        >
          {volquetas.length === 0 ? (
            <p className="text-center">No hay volquetas que superen las 48hs.</p>
          ) : (
            volquetas.map((volqueta) => (
              <Card key={volqueta.id} className="mb-1" style={{ fontSize: "0.9rem" }}>
                <Card.Body>
                  <p>
                    Volqueta: {volqueta.Movimientos[0]?.numeroVolqueta || "Desconocida"}{", en "}
                    <span
                      style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => handleNavigateToPedido(volqueta.id)}
                    >
                      {volqueta.Obra.calle}
                    </span>{" "}
                  </p>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default ListaVolquetasViaPublica;