import React, { useEffect, useState } from "react";


const CedulaDireccionEmpleado = ({empleado}) => {

    
  return (
    <div>
        <div>
            <div>
            <p><strong>Cédula:</strong> {empleado.cedula}</p>
            <p><strong>Dirección:</strong> {empleado.direccion}</p>
            </div>
        </div>
    </div>
  );
};

export default CedulaDireccionEmpleado;