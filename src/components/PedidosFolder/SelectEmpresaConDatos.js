import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { getEmpresaId } from "../../api";
import SelectEmpresaPorNombre from "../EmpresasFolder/SelectEmpresaPorNombre";

const SelectEmpresaConDatos = ({ onSeleccionar, getToken }) => {
  const [error, setError] = useState("");

  const handleSeleccionar = async (id, nombre) => {
    const usuarioToken = getToken();
    try {
      const response = await getEmpresaId(id, usuarioToken);
      onSeleccionar(response.data);
    } catch (error) {
      console.error("Error al obtener la empresa:", error.response?.data?.error || error.message);
      setError("Error al obtener la empresa");
    }
  };

  return (
    <>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <SelectEmpresaPorNombre onSeleccionar={handleSeleccionar} />
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default SelectEmpresaConDatos;