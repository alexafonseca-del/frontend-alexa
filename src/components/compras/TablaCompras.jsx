import { Table, Button, Pagination } from 'react-bootstrap';

const TablaCompras = ({
  compras, cargando, obtenerDetalles, abrirModalEdicion,
  abrirModalEliminacion, totalElementos, elementosPorPagina,
  paginaActual, establecerPaginaActual
}) => {
  if (cargando) return <div className="text-center">Cargando compras...</div>;

  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  return (
    <>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c) => (
            <tr key={c.id_compra}>
              <td>{c.id_compra}</td>
              <td>{new Date(c.fecha_compra).toLocaleString()}</td>
              <td>{c.nombre_empleado}</td>
              <td>C$ {parseFloat(c.total_compra).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="outline-info" onClick={() => obtenerDetalles(c.id_compra)}>
                  Detalles
                </Button>{' '}
                <Button size="sm" variant="outline-warning" onClick={() => abrirModalEdicion(c)}>
                  Editar
                </Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => abrirModalEliminacion(c)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPaginas)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === paginaActual}
            onClick={() => establecerPaginaActual(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
};

export default TablaCompras;

