import { Table, Spinner, Button } from "react-bootstrap";
import { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";


const TablaProductos = ({ productos,
  cargando, 
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual }) => {

  const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA ?? "").localeCompare(String(valorB ?? ""));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <>
        <Spinner animation="border">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>

            <BotonOrden campo="nombre_producto" orden={orden} manejarOrden={manejarOrden}>
              Nombre
            </BotonOrden>

            <BotonOrden campo="descripcion_producto" orden={orden} manejarOrden={manejarOrden}>
              Descripcion
            </BotonOrden>

            <BotonOrden campo="id_categoria" orden={orden} manejarOrden={manejarOrden}>
              Categoria
            </BotonOrden>

            <BotonOrden campo="precio_unitario" orden={orden} manejarOrden={manejarOrden}>
              Precio
            </BotonOrden>

            <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>
              Stock
            </BotonOrden>

            <BotonOrden campo="imagen" orden={orden} manejarOrden={manejarOrden}>
              Imagen
            </BotonOrden>

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.map((producto) => {
            return (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.descripcion_producto}</td>
                <td>{producto.id_categoria}</td>
                <td>{producto.precio_unitario}</td>
                <td>{producto.stock}</td>
                <td>
                  {producto.imagen ? (
                    <img
                      src={`data:image/png;base64,${producto.imagen}`}
                      alt={producto.nombre_producto}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    'Sin imagen'
                  )}
                </td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion && abrirModalEdicion(producto)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion && abrirModalEliminacion(producto)}
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
};

export default TablaProductos;