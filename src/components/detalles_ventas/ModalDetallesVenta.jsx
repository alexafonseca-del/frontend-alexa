import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetallesVenta = ({ mostrarModal, setMostrarModal, detalles }) => {
  return (
    <Modal show={mostrarModal} onHide={setMostrarModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length === 0 ? (
              <tr><td colSpan={4} className="text-center">No hay detalles</td></tr>
            ) : (
              detalles.map((d) => (
                <tr key={d.id_detalle_venta}>
                  <td>{d.nombre_producto}</td>
                  <td>{d.cantidad}</td>
                  <td>C$ {parseFloat(d.precio_unitario).toFixed(2)}</td>
                  <td>C$ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setMostrarModal}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesVenta;