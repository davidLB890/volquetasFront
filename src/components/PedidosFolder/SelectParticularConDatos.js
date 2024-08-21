import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { getParticularId } from "../../api";
import SelectParticularPorNombre from "../ParticularesFolder/SelectParticularPorNombre"; // Asegúrate de ajustar la ruta según sea necesario

const SelectParticularConDatos = ({ onSeleccionar, getToken }) => {
  const [error, setError] = useState("");

  const handleSeleccionar = async (id, nombre) => {
    const usuarioToken = getToken();
    try {
      const response = await getParticularId(id, usuarioToken);
      onSeleccionar(response.data);
    } catch (error) {
      console.error("Error al obtener el particular:", error.response?.data?.error || error.message);
      setError("Error al obtener el particular");
    }
  };

  return (
    <>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <SelectParticularPorNombre onSeleccionar={handleSeleccionar} />
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default SelectParticularConDatos;
