import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Collapse, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolquetas } from "../../features/volquetasSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ListaVolquetas.css"; // Asegúrate de ajustar la ruta según sea necesario

const ListaVolquetasResumida = () => {
  const dispatch = useDispatch();
  const { volquetas, loading, error } = useSelector((state) => state.volquetas);
  const getToken = useAuth();
  const navigate = useNavigate();
  const [showLista, setShowLista] = useState(false);

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
    dispatch(fetchVolquetas(usuarioToken));
  }, [dispatch, getToken, navigate]);

  const volquetasFiltradas = volquetas.filter(
    (volqueta) => volqueta.estado === "ok"
  );

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      {/* Pestaña flotante */}
      <div
        className="pestaña-flotante"
        style={{
          position: "fixed",
          bottom: showLista ? "300px" : "0",
          right: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px",
          borderRadius: "10px 10px 0 0",
          cursor: "pointer",
          transition: "bottom 0.3s",
        }}
        onClick={() => setShowLista(!showLista)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className={`bi bi-arrow-${showLista ? "down" : "up"}`}></i>
          <p style={{ margin: 0, marginLeft: "0.5rem" }}>Volquetas</p>
        </div>
      </div>

      {/* Contenedor deslizante */}
      <Collapse in={showLista}>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            width: showLista && window.innerWidth <= 768 ? "100%" : "30%",
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #dee2e6",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
          }}
          className="lista-volquetas"
        >
          {window.innerWidth <= 768 ? (
            // Vista tipo "cards" para pantallas pequeñas
            volquetasFiltradas.map((volqueta) => (
              <Card
                key={volqueta.numeroVolqueta}
                className={
                  volqueta.estado === "perdida" ? "volqueta-perdida" : ""
                }
                style={{ marginBottom: "10px" }}
              >
                <Card.Body>
                  <Card.Title>Volqueta #{volqueta.numeroVolqueta}</Card.Title>
                  <Card.Text>
                    <strong>Último movimiento:</strong>{" "}
                    {volqueta.Movimientos.length > 0 &&
                      volqueta.Movimientos.map((movimiento, index) => (
                        <div key={index}>
                          {movimiento.tipo === "entrega"
                            ? `Entregada en ${movimiento?.Pedido?.Obra?.calle}`
                            : movimiento.tipo === "levante"
                            ? `Levantada en ${movimiento?.Pedido?.Obra?.calle}`
                            : ""}
                        </div>
                      ))}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tipo:</strong> {volqueta.tipo}
                  </Card.Text>
                  <Card.Text>
                    <strong>Ocupada:</strong> {volqueta.ocupada ? "Sí" : "No"}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            // Tabla para pantallas grandes
            <Table striped bordered hover size="sm" className="table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Último movimiento</th>
                  <th>Tipo</th>
                  <th>Ocupada</th>
                </tr>
              </thead>
              <tbody>
                {volquetasFiltradas.map((volqueta) => (
                  <tr
                    key={volqueta.numeroVolqueta}
                    className={
                      volqueta.estado === "perdida" ? "volqueta-perdida" : ""
                    }
                  >
                    <td>{volqueta.numeroVolqueta}</td>
                    <td>
                      {volqueta.Movimientos.length > 0 &&
                        volqueta.Movimientos.map((movimiento, index) => (
                          <div key={index}>
                            {movimiento.tipo === "entrega"
                              ? `Entregada en ${movimiento?.Pedido?.Obra?.calle}`
                              : movimiento.tipo === "levante"
                              ? `Levantada en ${movimiento?.Pedido?.Obra?.calle}`
                              : ""}
                          </div>
                        ))}
                    </td>
                    <td>{volqueta.tipo}</td>
                    <td>{volqueta.ocupada ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default ListaVolquetasResumida;
