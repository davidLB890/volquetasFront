import React from "react";
import { Card } from "react-bootstrap";
import DatosContactoEmpresa from "./DatosContactoEmpresa"; // Ajusta la ruta según sea necesario

const ContactosEmpresa = ({ contactos }) => {
  return (
    <div>
      {contactos.map((contacto) => (
        <div key={contacto.id}>
          <DatosContactoEmpresa contacto={contacto} />
        </div>
      ))}
    </div>
  );
};

export default ContactosEmpresa;
