import {Table, Spinner} from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import { useState } from "react";

const TablaCategorias = ({categorias, cargando}) => {

  const [orden, setOrden] = useState({ campo: "id_categoria", direccion: "asc" });

  const manejarOrden = (campo) => {
  setOrden((prev) => ({
    campo,
    direccion:
      prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
  }));
};


const categoriasOrdenadas = [...categorias].sort((a, b) => {
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
            <BotonOrden campo="id_categoria" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="nombre_categoria" orden={orden} manejarOrden={manejarOrden}>
              Nombre Categoría
            </BotonOrden>
            <BotonOrden campo="descripcion_categoria" orden={orden} manejarOrden={manejarOrden}>
              Descripción Categoría
            </BotonOrden>
          <th>Acciones</th> 
        </tr>
      </thead>
      <tbody>
        {categoriasOrdenadas.map((categoria) => {
          return(
            <tr key={categoria.id_categoria}>
              <td>{categoria.id_categoria}</td>
              <td>{categoria.nombre_categoria}</td>
              <td>{categoria.descripcion_categoria}</td>
              <td>Acción</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
    </>
  );
}

export default TablaCategorias;