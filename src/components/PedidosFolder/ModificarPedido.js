import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import {
  putPedido,
  getPermisoIdEmpresa,
  postPermiso,
  getParticularId,
  getEmpresaId,
  putPedidoPermiso,
} from "../../api";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { updatePedido } from "../../features/pedidoSlice";
import AlertMessage from "../AlertMessage";
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Asegúrate de ajustar la ruta según sea necesario
import SelectObra from "../ObrasFolder/SelectObra"; // Asegúrate de ajustar la ruta según sea necesario
import AgregarObra from "../ObrasFolder/AgregarObra"; // Asegúrate de ajustar la ruta según sea necesario

const ModificarPedido = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const pedido = useSelector((state) => state.pedido.pedido);
  const descripcionPedido = useSelector((state) => state.pedido.pedido.descripcion) || "";
  const perisoIdPedido = useSelector((state) => state.pedido.pedido.permisoId) || "";
  const nroPesadaPedido = useSelector((state) => state.pedido.pedido.nroPesada) || "";
  const obraPedido = useSelector((state) => state.pedido.obra) || "";

  const [descripcion, setDescripcion] = useState(pedido.descripcion || "");
  const [permisoId, setPermisoId] = useState(pedido.permisoId || "");
  const [nroPesada, setNroPesada] = useState(pedido.nroPesada || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [permisos, setPermisos] = useState([]);
  const [useNewPermiso, setUseNewPermiso] = useState(false);
  const [nuevoPermiso, setNuevoPermiso] = useState({
    fechaCreacion: "",
    fechaVencimiento: "",
    empresaId: pedido.Obra?.empresa?.id || null,
    particularId: pedido.Obra?.particular?.id || null,
    id: "",
  });
  const [obras, setObras] = useState([]);
  const [selectedObra, setSelectedObra] = useState(pedido.Obra?.id || "");
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const empresaObraId = pedido.Obra?.empresa?.id;
  const particularObraId = pedido.Obra?.particular?.id;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const MAX_LENGTH = 255;

  const buscarObrasCliente = async () => {
    const usuarioToken = getToken();
    if (empresaObraId) {
      try {
        const response = await getEmpresaId(empresaObraId, usuarioToken);
        setObras(response.data.obras);
      } catch (error) {
        console.error(
          "Error al obtener las obras:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener las obras");
      }
    } else if (particularObraId) {
      try {
        const response = await getParticularId(particularObraId, usuarioToken);
        setObras(response.data.obras);
      } catch (error) {
        console.error(
          "Error al obtener las obras:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener las obras");
      }
    }
  };

  useEffect(() => {
    buscarObrasCliente();
  }, [getToken, pedido]);

  useEffect(() => {
    const fetchPermisos = async () => {
      if (selectedObra) {
        const obra = obras.find((o) => o.id === selectedObra);
        if (obra && obra.empresa) {
          const usuarioToken = getToken();
          try {
            const response = await getPermisoIdEmpresa(
              obra.empresa.id,
              usuarioToken
            );
            setPermisos(response.data);
            // Establecer el permiso actual como seleccionado
            setPermisoId(pedido.permisoId || "");
          } catch (error) {
            console.error(
              "Error al obtener los permisos:",
              error.response?.data?.error || error.message
            );
            setError("Error al obtener los permisos");
          }
        }
      }
    };

    fetchPermisos();
  }, [getToken, selectedObra, obras]);

  useEffect(() => {
    // Esto para verificar que si se está usando un nuevo permiso, los campos estén llenos antes de habilitar el botón
    const validateFields = () => {
      return (
        nuevoPermiso.fechaCreacion.trim() !== "" &&
        nuevoPermiso.fechaVencimiento.trim() !== "" &&
        nuevoPermiso.id.trim() !== ""
      );
    };

    if (useNewPermiso) {
      setIsButtonEnabled(validateFields());
    } else {
      setIsButtonEnabled(true);
    }
  }, [nuevoPermiso, useNewPermiso]);

  const handleModificar = async () => {
    const usuarioToken = getToken();
    if(descripcion.length > MAX_LENGTH) {
      setError("La descripción no puede superar los 255 caracteres");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    try {
      // Primero actualizo el pedido con la obra
      const pedidoModificado = {
        descripcion,
        nroPesada,
        obraId: selectedObra,
      };
      await putPedido(pedido.id, pedidoModificado, usuarioToken);
      // Luego actualizar el permiso si es necesario
      let permisoSeleccionadoId = permisoId ? permisoId : null;

      if (useNewPermiso) {
        try {
          const responsePermiso = await postPermiso(nuevoPermiso, usuarioToken);
          permisoSeleccionadoId = responsePermiso.data.id;
        } catch (error) {
          setError("Error al crear el permiso" + " - " + error.response.data.detalle);
          return;
        }
      }

      // Modifico nuevamente el pedido con el permiso seleccionado o nuevo
      await putPedidoPermiso(pedido.id, permisoSeleccionadoId, usuarioToken);

      setSuccess("Pedido modificado correctamente");
      setError("");
      dispatch(
        updatePedido({
          ...pedido,
          descripcion,
          nroPesada,
          obraId: selectedObra,
          permisoId: permisoSeleccionadoId,
        })
      );
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al modificar el pedido:", error);
      setError(error.response?.data?.detalle || error.message);
      setSuccess("");
    }
  };

  const handleNuevoPermisoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPermiso({ ...nuevoPermiso, [name]: value });
  };

  const handleObraAgregada = (nuevaObra) => {
    setObras([...obras, nuevaObra]);
    setSelectedObra(nuevaObra.id);
    setShowAgregarObra(false);
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>

            <SelectObra
              obras={obras}
              obraSeleccionada={selectedObra}
              onSelect={setSelectedObra}
              onNuevaObra={() => setShowAgregarObra(true)}
            />

            <Form.Group controlId="formPermisoOption">
              <Form.Label>
                {" "}
                Permiso 
              </Form.Label>
              <div style={{ marginLeft: "20px" }}>
                <Form.Check
                  type="checkbox"
                  label="Crear Nuevo Permiso"
                  checked={useNewPermiso}
                  onChange={() => setUseNewPermiso(!useNewPermiso)}
                />
                {useNewPermiso ? (
                  <>
                    <Form.Group
                      controlId="formFechaCreacion"
                      style={{ marginLeft: "20px" }}
                    >
                      <Form.Label>Fecha de Creación *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaCreacion"
                        value={nuevoPermiso.fechaCreacion}
                        onChange={handleNuevoPermisoChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="formFechaVencimiento"
                      style={{ marginLeft: "20px" }}
                    >
                      <Form.Label>Fecha de Vencimiento *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaVencimiento"
                        value={nuevoPermiso.fechaVencimiento}
                        onChange={handleNuevoPermisoChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="formNumero"
                      style={{ marginLeft: "20px" }}
                    >
                      <Form.Label>Número permiso *</Form.Label>
                      <Form.Control
                        type="text"
                        name="id"
                        value={nuevoPermiso.id}
                        onChange={handleNuevoPermisoChange}
                        required
                      />
                    </Form.Group>
                  </>
                ) : (
                  <Form.Group
                    controlId="formPermisoId"
                    style={{ marginLeft: "20px" }}
                  >
                    <SelectPermiso
                      empresaId={empresaObraId ? empresaObraId : null}
                      particularId={particularObraId ? particularObraId : null}
                      onSelect={(permisoId) => setPermisoId(permisoId)}
                      selectedPermisoId={permisoId} // Aquí pasas el permisoId que tiene el pedido actual
                    />
                  </Form.Group>
                )}
              </div>
            </Form.Group>

            <Form.Group controlId="formNroPesada">
              <Form.Label>Nro Pesada</Form.Label>
              <Form.Control
                type="number"
                value={nroPesada}
                onChange={(e) => setNroPesada(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleModificar}
            disabled={!isButtonEnabled}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      <AgregarObra
        show={showAgregarObra}
        onHide={() => setShowAgregarObra(false)}
        onObraAgregada={handleObraAgregada}
        empresaId={pedido.Obra?.empresa?.id}
        particularId={pedido.Obra?.particular?.id}
      />
    </>
  );
};

export default ModificarPedido;
