import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCompra = ({ mostrar, setMostrar, compra, confirmarEliminacion }) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de eliminar la compra #{compra?.id_compra}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCompra;
