import React from 'react';
import { useSelector } from 'react-redux';

const Usuarios = () => {
    const usuarios = useSelector(state => state.usuarios.usuarios);

    return (
        <div className='card'>
            <h1>Usuarios</h1>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>{usuario.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default Usuarios;