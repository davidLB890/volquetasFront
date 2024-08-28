import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Dropdown, ButtonGroup } from 'react-bootstrap';
import { GearFill, PencilSquare, Trash } from 'react-bootstrap-icons';
import { getJornalesEmpleado, deleteJornal } from '../../api';
import useAuth from '../../hooks/useAuth';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localeData from 'dayjs/plugin/localeData';
import '../../assets/css/JornalEspecifico.css';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

dayjs.extend(localeData);
dayjs.locale('es');

const JornalEspecifico = ({ empleadoId, empleadoRol, empleadoNombre, fechaInicio, fechaFin, handleMostrarModificar, handleEliminarJornal: eliminarJornalExterno, onUpdate, datosEmpleado  }) => {
  const [jornales, setJornales] = useState([]);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [jornalToDelete, setJornalToDelete] = useState(null);
  const rolUsuario = localStorage.getItem('userRol');
  const getToken = useAuth();

  const fetchJornales = async () => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      return;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const fechaInicioActual = fechaInicio || startOfMonth;
    const fechaFinActual = fechaFin || endOfMonth;

    try {
      const response = await getJornalesEmpleado(empleadoId, fechaInicioActual, fechaFinActual, usuarioToken);
      const jornalesData = response.data || [];

      const jornalesOrdenados = jornalesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setJornales(jornalesOrdenados);
    } catch (error) {
      console.error('Error al obtener jornales del empleado:', error);
      setError('Error al obtener jornales del empleado.');
      setJornales([]);
    }
  };

  useEffect(() => {
    fetchJornales();
  }, [empleadoId, fechaInicio, fechaFin, onUpdate]); // Se actualiza cuando `empleadoId`, `fechaInicio`, `fechaFin` o `onUpdate` cambian

  const handleInternalEliminarJornal = async () => {
    const usuarioToken = getToken();
    if (!jornalToDelete || !usuarioToken) {
      return;
    }
    try {
      await deleteJornal(jornalToDelete.id, usuarioToken);
      // Eliminar el jornal de la lista después de la eliminación exitosa
      setJornales((prevJornales) =>
        prevJornales.filter((jornal) => jornal.id !== jornalToDelete.id)
      );
      setShowConfirm(false);
      setJornalToDelete(null);
      if (eliminarJornalExterno) {
        eliminarJornalExterno(jornalToDelete.id);
      }
    } catch (error) {
      console.error('Error al eliminar jornal:', error);
      setError('Error al eliminar jornal.');
    }
  };

  const exportarExcel = () => {
    // Crear la primera hoja con los datos generales del empleado
    const ws1 = XLSX.utils.json_to_sheet([
      {
        'Registros': datosEmpleado.registros,
        'Días de Trabajo': datosEmpleado.diasTrabajo,
        'Días de Licencia': datosEmpleado.diasLicencia,
        'Días de Enfermedad': datosEmpleado.diasEnfermedad,
        'Faltas': datosEmpleado.diasFalta,
        'Horas trabajadas': parseFloat(datosEmpleado.horasTrabajadas).toFixed(2),
        'Horas extra': datosEmpleado.horasExtra,
      },
    ]);
  
    // Configurar los datos para la segunda hoja
    const ws2Data = jornales.map(jornal => {
      const row = {
        'Fecha': dayjs(jornal.fecha).format('dddd, DD/MM/YYYY'),
        'Entrada': jornal.entrada,
        'Salida': jornal.salida,
        'Horas Extra': jornal.horasExtra,
        'Tipo': jornal.tipo,
      };
      if (empleadoRol === 'chofer') {
        row['Viajes Realizados'] = `-viajes: ${jornal.viajes} -entregas: ${jornal.entregas} -levantes: ${jornal.levantes}`;
      }
      return row;
    });
  
    // Crear la segunda hoja con los jornales específicos
    const ws2 = XLSX.utils.json_to_sheet(ws2Data);
  
    // Crear el libro de trabajo y agregar las hojas
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Datos del Empleado');
    XLSX.utils.book_append_sheet(wb, ws2, 'Jornales');
  
    // Guardar el archivo Excel con un nombre dinámico basado en el nombre del empleado
    XLSX.writeFile(wb, `Empleado_${empleadoNombre}_Reporte.xlsx`);
  };
  

  
  
  const exportarPDF = () => {
    const doc = new jsPDF();
  
    // Título del PDF
    doc.text(`Reporte del Empleado: ${empleadoNombre}`, 20, 10);
  
    // Agregar la primera tabla con los datos generales del empleado
    doc.autoTable({
      head: [["Registros", "Días de Trabajo", "Días de Licencia", "Días de Enfermedad", "Faltas", "Horas trabajadas", "Horas extra"]],
      body: [
        [
          datosEmpleado.registros,
          datosEmpleado.diasTrabajo,
          datosEmpleado.diasLicencia,
          datosEmpleado.diasEnfermedad,
          datosEmpleado.diasFalta,
          parseFloat(datosEmpleado.horasTrabajadas).toFixed(2),
          datosEmpleado.horasExtra,
        ],
      ],
      startY: 20,
    });
  
    // Espacio después de la primera tabla
    const startY = doc.autoTable.previous.finalY + 10;
  
    // Definir el encabezado y el cuerpo de la tabla dependiendo del rol
    const head = empleadoRol === 'chofer'
      ? [["Fecha", "Entrada", "Salida", "Horas Extra", "Tipo", "Viajes Realizados"]]
      : [["Fecha", "Entrada", "Salida", "Horas Extra", "Tipo"]];
  
    const body = jornales.map(jornal => {
      const row = [
        dayjs(jornal.fecha).format('dddd, DD/MM/YYYY'),
        jornal.entrada,
        jornal.salida,
        jornal.horasExtra,
        jornal.tipo,
      ];
      if (empleadoRol === 'chofer') {
        row.push(`-viajes: ${jornal.viajes} -entregas: ${jornal.entregas} -levantes: ${jornal.levantes}`);
      }
      return row;
    });
  
    // Agregar la segunda tabla con los jornales específicos
    doc.autoTable({
      head: head,
      body: body,
      startY: startY,
    });
  
    // Guardar el PDF con un nombre dinámico basado en el nombre del empleado
    doc.save(`Empleado_${empleadoNombre}_Reporte.pdf`);
  };
  

  

  const confirmEliminarJornal = (jornal) => {
    setJornalToDelete(jornal);
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setJornalToDelete(null);
  };

  return (
    <>
      {/* Tabla para pantallas medianas y grandes */}
      <div className="table-responsive d-none d-md-block">
      <div className="d-flex justify-content-end mb-3">
      <Button variant="success" onClick={exportarExcel} className="me-2">
        Exportar a Excel
      </Button>
      <Button variant="danger" onClick={exportarPDF}>
        Exportar a PDF
      </Button>
    </div>
        {jornales.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Horas Extra</th>
                <th>Tipo</th>
                {empleadoRol === 'chofer' && <th>Viajes Realizados</th>}
                {rolUsuario === 'admin' && <th></th>}
              </tr>
            </thead>
            <tbody>
              {jornales.map((jornal) => (
                <tr
                  key={jornal.id}
                  className={
                    jornal.tipo === 'trabajo'
                      ? 'trabajo'
                      : jornal.tipo === 'licencia'
                      ? 'licencia'
                      : jornal.tipo === 'falta'
                      ? 'falta'
                      : 'enfermedad'
                  }
                >
                  <td>{dayjs(jornal.fecha).format('dddd, DD/MM/YYYY')}</td>
                  <td>{jornal.entrada}</td>
                  <td>{jornal.salida}</td>
                  <td>{jornal.horasExtra}</td>
                  <td>{jornal.tipo}</td>
                  {empleadoRol === 'chofer' && <td>-viajes: {jornal.viajes} -entregas: {jornal.entregas} -levantes: {jornal.levantes}</td>}
                  {rolUsuario === 'admin' && (
                    <td>
                    <Dropdown as={ButtonGroup} style={{ marginLeft: "0.5rem" }}>
                      <Dropdown.Toggle
                        as={Button}
                        variant="link"
                        style={{
                          padding: 0,
                          margin: 0,
                          border: "none",
                          background: "none",
                          boxShadow: "none",
                        }}
                      >
                        <GearFill size={24} />
                      </Dropdown.Toggle>
                  
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleMostrarModificar(jornal)}
                        >
                          <PencilSquare className="me-2" /> Modificar
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => confirmEliminarJornal(jornal)}
                        >
                          <Trash className="me-2" /> Eliminar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">
            No se encontraron jornales para el empleado seleccionado en el rango
            de fechas especificado.
          </Alert>
        )}
      </div>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="d-md-none">
        {jornales.length > 0 ? (
          jornales.map((jornal) => (
            <div key={jornal.id} className="jornal-item">
              <p><strong>Fecha:</strong> {dayjs(jornal.fecha).format('dddd, DD/MM/YYYY')}</p>
              <p><strong>Entrada:</strong> {jornal.entrada}</p>
              <p><strong>Salida:</strong> {jornal.salida}</p>
              <p><strong>Horas Extra:</strong> {jornal.horasExtra}</p>
              <p><strong>Tipo:</strong> {jornal.tipo}</p>
              {empleadoRol === 'chofer' && (
                <p><strong>Viajes Realizados:</strong> {`-viajes: ${jornal.viajes} -entregas: ${jornal.entregas} -levantes: ${jornal.levantes}`}</p>
              )}
              {rolUsuario === 'admin' && (
                <div className="jornal-actions">
                  <Dropdown as={ButtonGroup} style={{ marginLeft: "0.5rem" }}>
                      <Dropdown.Toggle
                        as={Button}
                        variant="link"
                        style={{
                          padding: 0,
                          margin: 0,
                          border: "none",
                          background: "none",
                          boxShadow: "none",
                        }}
                      >
                        <GearFill size={24} />
                      </Dropdown.Toggle>
                  
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleMostrarModificar(jornal)}
                        >
                          <PencilSquare className="me-2" /> Modificar
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => confirmEliminarJornal(jornal)}
                        >
                          <Trash className="me-2" /> Eliminar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                </div>
              )}
            </div>
          ))
        ) : (
          <Alert variant="info">
            No se encontraron jornales para el empleado seleccionado en el rango
            de fechas especificado.
          </Alert>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirm} onHide={handleCloseConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar este jornal?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleInternalEliminarJornal}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JornalEspecifico;
