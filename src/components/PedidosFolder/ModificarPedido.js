import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  putPedido,
  getPermisoIdEmpresa,
  postPermiso,
  getObras,
  getParticularId,
  getEmpresaId,
} from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Asegúrate de ajustar la ruta según sea necesario
import SelectObra from "../ObrasFolder/SelectObra"; // Asegúrate de ajustar la ruta según sea necesario
import AgregarObra from "../ObrasFolder/AgregarObra"; // Asegúrate de ajustar la ruta según sea necesario

const ModificarPedido = ({ show, onHide, pedido, onPedidoModificado }) => {
  const [descripcion, setDescripcion] = useState(pedido.descripcion || "");
  const [permisoId, setPermisoId] = useState(pedido.permisoId || "");
  const [nroPesada, setNroPesada] = useState(pedido.nroPesada || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [permisos, setPermisos] = useState([]);
  const [useNewPermiso, setUseNewPermiso] = useState(!permisoId);
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
  const getToken = useAuth();

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

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      // Primero actualizar la obra
      const pedidoModificado = {
        descripcion,
        nroPesada,
        obraId: selectedObra,
      };

      const responseObra = await putPedido(
        pedido.id,
        pedidoModificado,
        usuarioToken
      );

      // Luego actualizar el permiso si es necesario
      let permisoSeleccionadoId = permisoId;

      if (useNewPermiso) {
        const responsePermiso = await postPermiso(nuevoPermiso, usuarioToken);
        permisoSeleccionadoId = responsePermiso.data.id;
      }

      const responsePermiso = await putPedido(
        pedido.id,
        { permisoId: permisoSeleccionadoId },
        usuarioToken
      );

      setSuccess("Pedido modificado correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onPedidoModificado(responsePermiso.data);
        onHide();
      }, 2000);
    } catch (error) {
      console.error(
        "Error al modificar el pedido:",
        error.response?.data?.error || error.message
      );
      setError("Error al modificar el pedido");
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
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
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
              <Form.Label>Permiso</Form.Label>
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
                      <Form.Label>Fecha de Creación</Form.Label>
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
                      <Form.Label>Fecha de Vencimiento</Form.Label>
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
                      <Form.Label>Número permiso</Form.Label>
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
                      empresaId={
                        empresaObraId
                      }
                      onSelect={(permisoId) => setPermisoId(permisoId)}
                    />
                  </Form.Group>
                )}
              </div>
            </Form.Group>

            <Form.Group controlId="formNroPesada">
              <Form.Label>Nro Pesada</Form.Label>
              <Form.Control
                type="text"
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
          <Button variant="primary" onClick={handleModificar}>
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


/* import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { putPedido, getPermisoIdEmpresa, postPermiso } from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Asegúrate de ajustar la ruta según sea necesario

const ModificarPedido = ({ show, onHide, pedido, onPedidoModificado }) => {
  const [descripcion, setDescripcion] = useState(pedido.descripcion || "");
  const [permisoId, setPermisoId] = useState(pedido.permisoId || "");
  const [nroPesada, setNroPesada] = useState(pedido.nroPesada || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [permisos, setPermisos] = useState([]);
  const [useNewPermiso, setUseNewPermiso] = useState(!permisoId);
  const [nuevoPermiso, setNuevoPermiso] = useState({
    fechaCreacion: "",
    fechaVencimiento: "",
    empresaId: pedido.Obra?.empresa?.id || null,
    particularId: pedido.Obra?.particular?.id || null,
    id: "",
  });
  const getToken = useAuth();

  useEffect(() => {
    const fetchPermisos = async () => {
      if (pedido.Obra && pedido.Obra.empresa) {
        const usuarioToken = getToken();
        try {
          const response = await getPermisoIdEmpresa(pedido.Obra.empresa.id, usuarioToken);
          setPermisos(response.data);
        } catch (error) {
          console.error(
            "Error al obtener los permisos:",
            error.response?.data?.error || error.message
          );
          setError("Error al obtener los permisos");
        }
      }
    };
    fetchPermisos();
  }, [pedido, getToken]);

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      let permisoSeleccionadoId = permisoId;

      if (useNewPermiso) {
        const response = await postPermiso(nuevoPermiso, usuarioToken);
        permisoSeleccionadoId = response.data.id;
      }

      const pedidoModificado = {
        descripcion,
        permisoId: permisoSeleccionadoId,
        nroPesada,
      };

      const response = await putPedido(pedido.id, pedidoModificado, usuarioToken);
      setSuccess("Pedido modificado correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onPedidoModificado(response.data);
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al modificar el pedido:", error.response?.data?.error || error.message);
      setError("Error al modificar el pedido");
      setSuccess("");
    }
  };

  const handleNuevoPermisoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPermiso({ ...nuevoPermiso, [name]: value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}
        <Form>
          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group controlId="formPermisoOption">
  <Form.Label>Permiso</Form.Label>
  <div style={{ marginLeft: "20px" }}>
    <Form.Check
      type="checkbox"
      label="Crear Nuevo Permiso"
      checked={useNewPermiso}
      onChange={() => setUseNewPermiso(!useNewPermiso)}
    />
    {useNewPermiso ? (
      <>
        <Form.Group controlId="formFechaCreacion" style={{ marginLeft: "20px" }}>
          <Form.Label>Fecha de Creación</Form.Label>
          <Form.Control
            type="date"
            name="fechaCreacion"
            value={nuevoPermiso.fechaCreacion}
            onChange={handleNuevoPermisoChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formFechaVencimiento" style={{ marginLeft: "20px" }}>
          <Form.Label>Fecha de Vencimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaVencimiento"
            value={nuevoPermiso.fechaVencimiento}
            onChange={handleNuevoPermisoChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formNumero" style={{ marginLeft: "20px" }}>
          <Form.Label>Número permiso</Form.Label>
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
      <Form.Group controlId="formPermisoId" style={{ marginLeft: "20px" }}>
        <SelectPermiso
          empresaId={pedido.Obra?.empresa?.id}
          permisos={permisos}
          selectedPermiso={permisoId}
          onSelect={(permisoId) => setPermisoId(permisoId)}
        />
      </Form.Group>
    )}
  </div>
</Form.Group>

          <Form.Group controlId="formNroPesada">
            <Form.Label>Nro Pesada</Form.Label>
            <Form.Control
              type="text"
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
        <Button variant="primary" onClick={handleModificar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarPedido;
 */
