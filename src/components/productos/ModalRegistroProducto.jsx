import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="nombre_producto">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_producto"
                  value={nuevoProducto.nombre_producto}
                  onChange={manejarCambioInput}
                  placeholder="Ej: Taladro"
                  maxLength={100}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="id_categoria">
                <Form.Label>ID Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="id_categoria"
                  value={nuevoProducto.id_categoria}
                  onChange={manejarCambioInput}
                  placeholder="ID de la categoría"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="precio_unitario">
                <Form.Label>Precio Unitario</Form.Label>
                <Form.Control
                  type="number"
                  name="precio_unitario"
                  value={nuevoProducto.precio_unitario}
                  onChange={manejarCambioInput}
                  placeholder="0.00"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="stock">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={nuevoProducto.stock}
                  onChange={manejarCambioInput}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="descripcion_producto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_producto"
              value={nuevoProducto.descripcion_producto}
              onChange={manejarCambioInput}
              placeholder="Descripción opcional (máx. 300 caracteres)"
              maxLength={300}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenProducto">
  <Form.Label>Imagen</Form.Label>
  <Form.Control
    type="file"
    name="imagen"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          manejarCambioInput({
            target: { name: 'imagen', value: reader.result.split(',')[1] } // Extrae solo la parte Base64
          });
        };
        reader.readAsDataURL(file);
      }
    }}
  />
</Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarProducto}
          disabled={!nuevoProducto.nombre_producto?.trim()}
        >
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;