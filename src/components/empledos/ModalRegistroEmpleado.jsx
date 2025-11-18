import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroEmpleado = ({
  mostrarModal,
  setMostrarModal,
  nuevoEmpleado,
  manejarCambioInput,
  agregarEmpleado,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="primer_nombre">
                <Form.Label>Primer Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="primer_nombre"
                  value={nuevoEmpleado.primer_nombre}
                  onChange={manejarCambioInput}
                  maxLength={20}
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="segundo_nombre">
                <Form.Label>Segundo Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="segundo_nombre"
                  value={nuevoEmpleado.segundo_nombre}
                  onChange={manejarCambioInput}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="primer_apellido">
                <Form.Label>Primer Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="primer_apellido"
                  value={nuevoEmpleado.primer_apellido}
                  onChange={manejarCambioInput}
                  maxLength={20}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="segundo_apellido">
                <Form.Label>Segundo Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="segundo_apellido"
                  value={nuevoEmpleado.segundo_apellido}
                  onChange={manejarCambioInput}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="celular">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="text"
                  name="celular"
                  value={nuevoEmpleado.celular}
                  onChange={manejarCambioInput}
                  maxLength={8}
                  placeholder="88888888"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="cargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Control
                  type="text"
                  name="cargo"
                  value={nuevoEmpleado.cargo}
                  onChange={manejarCambioInput}
                  maxLength={20}
                  placeholder="Ej: Vendedor"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="fecha_contratacion">
            <Form.Label>Fecha de Contratación *</Form.Label>
            <Form.Control
              type="date"
              name="fecha_contratacion"
              value={nuevoEmpleado.fecha_contratacion}
              onChange={manejarCambioInput}
              required
            />
            <Form.Text className="text-muted">
              Por defecto es hoy, pero puedes cambiarla.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarEmpleado}
          disabled={!nuevoEmpleado.primer_nombre.trim() || !nuevoEmpleado.primer_apellido.trim() || !nuevoEmpleado.fecha_contratacion}
        >
          Guardar Empleado
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEmpleado;