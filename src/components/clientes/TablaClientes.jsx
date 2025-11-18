import {Table, Spinner, Button} from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import { useState } from "react";
import Paginacion
 from "../ordenamiento/Paginacion";

const TablaClientes = ({clientes, 
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual}) => {

  const [orden, setOrden] = useState({ campo: "id_cliente", direccion: "asc" });

  const manejarOrden = (campo) => {
  setOrden((prev) => ({
    campo,
    direccion:
      prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
  }));
};


const clientesOrdenados = [...clientes].sort((a, b) => {
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
            <BotonOrden campo="id_cliente" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="primer_nombre" orden={orden} manejarOrden={manejarOrden}>
              primer nombre
            </BotonOrden>
            <BotonOrden campo="segundo_nombre" orden={orden} manejarOrden={manejarOrden}>
              segundo nombre
            </BotonOrden>
            <BotonOrden campo="primer_apellido" orden={orden} manejarOrden={manejarOrden}>
              primer apellido
            </BotonOrden>
            <BotonOrden campo="segundo_apellido" orden={orden} manejarOrden={manejarOrden}>
              segundo apellido
            </BotonOrden>
            <BotonOrden campo="celular" orden={orden} manejarOrden={manejarOrden}>
              celular
            </BotonOrden>
            <BotonOrden campo="direccion" orden={orden} manejarOrden={manejarOrden}>
              direccion
            </BotonOrden>
            <BotonOrden campo="cedula" orden={orden} manejarOrden={manejarOrden}>
              cedula
            </BotonOrden>
            <th>Acciones</th> 
        </tr>
      </thead>
      <tbody>
        {clientesOrdenados.map((cliente) => {
          return(
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.primer_nombre}</td>
              <td>{cliente.segundo_nombre}</td>
              <td>{cliente.primer_apellido}</td>
              <td>{cliente.segundo_apellido}</td>
              <td>{cliente.celular}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.cedula}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(cliente)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(cliente)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
    <Paginacion
      elementosPorPagina={elementosPorPagina}
      totalElementos={totalElementos}
      paginaActual={paginaActual}
      establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
}

export default TablaClientes;