import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCategoria = ({
  mostrar,
  setMostrar,
  categoriaEditada,
  setCategoriaEditada,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCategoriaEditada((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="nombreCategoria">
            <Form.Label>Nombre de la Categoría</Form.Label>
            <Form.Control
              type="text"
              name="nombre_categoria"
              value={categoriaEditada?.nombre_categoria || ""}
              onChange={manejarCambio}
              placeholder="Ej: Herramientas"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcionCategoria">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_categoria"
              value={categoriaEditada?.descripcion_categoria || ""}
              onChange={manejarCambio}
              placeholder="Descripción opcional (máx. 100 caracteres)"
              maxLength={100}
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
          disabled={!categoriaEditada?.nombre_categoria?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;