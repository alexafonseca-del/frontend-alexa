import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({ mostrar, setMostrar, venta, confirmarEliminacion }) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de eliminar la venta #{venta?.id_venta}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;