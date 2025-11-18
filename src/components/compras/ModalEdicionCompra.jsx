import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';

const ModalEdicionCompra = ({
  mostrar,
  setMostrar,
  compra,
  compraEnEdicion,
  setCompraEnEdicion,
  detalles,
  setDetalles,
  empleados,
  productos,
  actualizarCompra
}) => {
  // cliente eliminado para Compras
  const [empleadoSel, setEmpleadoSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '' });

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (compra && empleados.length > 0 && compraEnEdicion) {
      const empleado = empleados.find(e => e.id_empleado === compraEnEdicion.id_empleado);
      setEmpleadoSel(empleado ? { value: empleado.id_empleado, label: `${empleado.primer_nombre} ${empleado.primer_apellido}` } : null);
    }
  }, [compra, empleados, compraEnEdicion]);

  const total = detalles.reduce((s, d) => s + (d.cantidad * d.precio_unitario), 0);

  const cargarOpciones = (lista, campo) => (input, callback) => {
    const filtrados = lista.filter(item => {
      const valor = typeof campo === 'string' ? item[campo] : `${item.primer_nombre} ${item.primer_apellido}`;
      return valor?.toLowerCase().includes(input.toLowerCase());
    });
    callback(filtrados.map(item => ({
      value: item.id_empleado || item.id_producto,
      label: campo === 'nombre_producto' ? item.nombre_producto : `${item.primer_nombre} ${item.primer_apellido}`,
      precio: item.precio_unitario,
      stock: item.stock
    })));
  };

  const manejarEmpleado = (sel) => {
    setEmpleadoSel(sel);
    setCompraEnEdicion(prev => ({ ...prev, id_empleado: sel ? sel.value : '' }));
  };

  const manejarProducto = (sel) => {
    setProductoSel(sel);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: sel ? sel.value : '',
      precio_unitario: sel ? sel.precio : ''
    }));
  };

  const agregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert("Selecciona producto y cantidad válida.");
      return;
    }

    const prod = productos.find(p => p.id_producto === parseInt(nuevoDetalle.id_producto));
    if (!prod) return;

    if (nuevoDetalle.cantidad > prod.stock) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [...prev, {
      id_producto: parseInt(nuevoDetalle.id_producto),
      nombre_producto: prod.nombre_producto,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    }] );

    setNuevoDetalle({ id_producto: '', cantidad: '' });
    setProductoSel(null);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal show={mostrar} onHide={setMostrar} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>Editar Compra #{compra?.id_compra}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                {/* Cliente eliminado para Compras */}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Empleado</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarOpciones(empleados, 'primer_nombre')}
                  onChange={manejarEmpleado}
                  value={empleadoSel}
                  placeholder="Buscar empleado..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="text"
                  value={compraEnEdicion?.fecha_compra || ''}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Productos</h5>
          <Row>
            <Col md={5}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarOpciones(productos, 'nombre_producto')}
                onChange={manejarProducto}
                value={productoSel}
                placeholder="Buscar producto..."
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormControl
                type="number"
                placeholder="Cantidad"
                value={nuevoDetalle.cantidad}
                onChange={e => setNuevoDetalle(prev => ({ ...prev, cantidad: e.target.value }))}
                min="1"
              />
            </Col>
            <Col md={4}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: '100%' }}>
                Agregar
              </Button>
            </Col>
          </Row>

          {detalles.length > 0 && (
            <Table striped className="mt-3">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_producto}</td>
                    <td>{d.cantidad}</td>
                    <td>C$ {d.precio_unitario.toFixed(2)}</td>
                    <td>C$ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => eliminarDetalle(i)}>
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                  <td colSpan={2}><strong>C$ {total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </Table>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setMostrar}>Cancelar</Button>
        <Button variant="primary" onClick={actualizarCompra}>Actualizar Compra</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;
