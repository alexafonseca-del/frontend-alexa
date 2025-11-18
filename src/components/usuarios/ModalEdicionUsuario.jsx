import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionUsuario = ({
  mostrar,
  setMostrar,
  usuarioEditado,
  setUsuarioEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="usuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  value={usuarioEditado?.usuario}
                  onChange={manejarCambio}
                  placeholder="Nombre del usuario"
                  maxLength={100}
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="contraseña">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="text"
                  name="contraseña"
                  value={usuarioEditado?.contraseña}
                  onChange={manejarCambio}
                  placeholder="Contraseña"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!usuarioEditado?.usuario?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionUsuario;