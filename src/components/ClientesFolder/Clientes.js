import React from "react";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getParticulares, getEmpresas, getContactoEmpresa } from "../../api";
import useAuth from "../../hooks/useAuth";

const Clientes = () => {
  const [clientesParticulares, setClientesParticulares] = useState([]);
  const [clientesEmpresas, setClientesEmpresas] = useState([]);
  const [contactoEmpresas, setContactoEmpresas] = useState([]);

  const navigate = useNavigate();
  const getToken = useAuth()

  useEffect(() => {
    const usuarioToken = getToken();
    const fetchClientesParticulares = async () => {
      const response = await getParticulares(usuarioToken);
      setClientesParticulares(response.data);
    };

    const fetchClientesEmpresas = async () => {
      const response = await getEmpresas(usuarioToken);
      setClientesEmpresas(response.data);
    };

    const fetchContactoEmpresas = async () => {
      const response = await getContactoEmpresa(usuarioToken);
      setContactoEmpresas(response.data);
    };

    fetchClientesParticulares();
    fetchClientesEmpresas();
    fetchContactoEmpresas();
  }, []);


  return (
    <div className="container">
      <div className="header">
        <h1>Lista de Clientes</h1>
        <Button variant="primary" onClick={() => navigate("/clientes/crear")}>
          Nuevo Cliente
        </Button>
      </div>
      <div>
        <h2>Particulares</h2>
        <ul>
          {clientesParticulares.map((cliente) => (
            <li key={cliente.id}>{cliente.nombre}</li>
          ))}
        </ul>
      </div>  


    </div>
  );
};

export default Clientes;
