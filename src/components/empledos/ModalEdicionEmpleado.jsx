import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionEmpleado = ({
  mostrar,
  setMostrar,
  empleadoEditado,
  setEmpleadoEditado,
  guardarEdicion,
}) => {

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
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
                  value={empleadoEditado?.primer_nombre || ''}
                  onChange={manejarCambio}
                  maxLength={20}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="segundo_nombre">
                <Form.Label>Segundo Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="segundo_nombre"
                  value={empleadoEditado?.segundo_nombre || ''}
                  onChange={manejarCambio}
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
                  value={empleadoEditado?.primer_apellido || ''}
                  onChange={manejarCambio}
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
                  value={empleadoEditado?.segundo_apellido || ''}
                  onChange={manejarCambio}
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
                  value={empleadoEditado?.celular || ''}
                  onChange={manejarCambio}
                  maxLength={8}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="cargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Control
                  type="text"
                  name="cargo"
                  value={empleadoEditado?.cargo || ''}
                  onChange={manejarCambio}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="fecha_contratacion">
            <Form.Label>Fecha de Contratación *</Form.Label>
            <Form.Control
              type="date"
              name="fecha_contratacion"
              value={
                empleadoEditado?.fecha_contratacion
                  ? new Date(empleadoEditado.fecha_contratacion).toISOString().split("T")[0]
                  : ""
              }
              onChange={manejarCambio}
              required
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={
            !empleadoEditado?.primer_nombre?.trim() ||
            !empleadoEditado?.primer_apellido?.trim() ||
            !empleadoEditado?.fecha_contratacion
          }
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEmpleado;