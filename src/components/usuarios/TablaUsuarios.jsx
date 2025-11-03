import {Table, Spinner} from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import { useState } from "react";

const TablaUsuarios = ({usuarios, cargando}) => {

  const [orden, setOrden] = useState({ campo: "id_usuario", direccion: "asc" });

  const manejarOrden = (campo) => {
  setOrden((prev) => ({
    campo,
    direccion:
      prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
  }));
};


const usuariosOrdenadas = [...usuarios].sort((a, b) => {
  const valorA = a[orden.campo];
  const valorB = b[orden.campo];

  // Si ambos valores son números, se ordena numéricamente
  if (typeof valorA === "number" && typeof valorB === "number") {
    return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
  }

  // Si no son números, se ordena alfabéticamente
  const comparacion = String(valorA).localeCompare(String(valorB));
  return orden.direccion === "asc" ? comparacion : -comparacion;
});

  if(cargando){
    return(
      <>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </Spinner>
      </>
    );
  }
  return(
    <>
      <Table striped bordered hover>
      <thead>
        <tr>
            <BotonOrden campo="id_usuario" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="usuario" orden={orden} manejarOrden={manejarOrden}>
              usuario
            </BotonOrden>
            <BotonOrden campo="contraseña" orden={orden} manejarOrden={manejarOrden}>
              contraseña
            </BotonOrden>
            <th>Acciones</th> 
        </tr>
      </thead>
      <tbody>
        {usuariosOrdenadas.map((usuario) => {
          return(
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.contraseña}</td>
              <td>Acción</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
    </>
  );
}

export default TablaUsuarios;