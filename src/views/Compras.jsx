import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaCompras from "../components/compras/TablaCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCompra from "../components/compras/ModalRegistroCompra";
import ModalEdicionCompra from "../components/compras/ModalEdicionCompra";
import ModalEliminacionCompra from "../components/compras/ModalEliminacionCompra";
import ModalDetallesCompra from "../components/detalles_compras/ModalDetallesCompra";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [compraAEditar, setCompraAEditar] = useState(null);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [detallesCompra, setDetallesCompra] = useState([]);

  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const hoy = new Date().toISOString().split('T')[0];

  // Estado para registro (sin cliente)
  const [nuevaCompra, setNuevaCompra] = useState({
    id_empleado: '',
    fecha_compra: hoy,
    total_compra: 0
  });

  // Estado para edición
  const [compraEnEdicion, setCompraEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const obtenerNombreEmpleado = async (idEmpleado) => {
    if (!idEmpleado) return '—';
    try {
      const resp = await fetch(`http://localhost:3000/api/empleado/${idEmpleado}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return `${data.primer_nombre} ${data.primer_apellido}`;
    } catch (error) {
      console.error("Error al cargar nombre del empleado:", error);
      return '—';
    }
  };

  const obtenerNombreProducto = async (idProducto) => {
    if (!idProducto) return '—';
    try {
      const resp = await fetch(`http://localhost:3000/api/producto/${idProducto}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return data.nombre_producto || '—';
    } catch (error) {
      console.error("Error al cargar nombre del producto:", error);
      return '—';
    }
  };

  // ===== Cargar compras con nombres
  const obtenerCompras = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/compras');
      if (!resp.ok) throw new Error('Error al obtener compras');
      const comprasRaw = await resp.json();

      const comprasConNombres = await Promise.all(
        comprasRaw.map(async (c) => ({
          ...c,
          nombre_empleado: await obtenerNombreEmpleado(c.id_empleado)
        }))
      );

      setCompras(comprasConNombres);
      setComprasFiltradas(comprasConNombres);
      setCargando(false);
    } catch (error) {
      console.error(error);
      alert('Error al cargar compras.');
      setCargando(false);
    }
  };

  // ===== Cargar detalles de compra
  const obtenerDetallesCompra = async (id_compra) => {
    try {
      const resp = await fetch('http://localhost:3000/api/detallescompras');
      if (!resp.ok) throw new Error('Error al obtener detalles');
      const todos = await resp.json();
      const detallesRaw = todos.filter(d => d.id_compra === id_compra);

      const detallesConNombres = await Promise.all(
        detallesRaw.map(async (d) => ({
          ...d,
          nombre_producto: await obtenerNombreProducto(d.id_producto)
        }))
      );

      setDetallesCompra(detallesConNombres);
      setMostrarModalDetalles(true);
    } catch (error) {
      console.error(error);
      alert('Error al cargar detalles de compra.');
    }
  };

  // ===== Cargar catálogos
  const obtenerEmpleados = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/empleados');
      if (!resp.ok) return setEmpleados([]);
      const data = await resp.json();
      setEmpleados(data);
    } catch (error) { setEmpleados([]); }
  };

  const obtenerProductos = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/productos');
      if (!resp.ok) return setProductos([]);
      const data = await resp.json();
      setProductos(data);
    } catch (error) { setProductos([]); }
  };

  // ===== Búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = compras.filter(c =>
      c.id_compra.toString().includes(texto) ||
      (c.nombre_empleado && c.nombre_empleado.toLowerCase().includes(texto))
    );
    setComprasFiltradas(filtrados);
    setPaginaActual(1);
  };

  // ===== Registro
  const agregarCompra = async () => {
    if (!nuevaCompra.id_empleado || detallesNuevos.length === 0) {
      alert('Faltan datos o no hay productos.');
      return;
    }

    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

    try {
      const resp = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...nuevaCompra, total_compra: total })
      });
      if (!resp.ok) throw new Error('Error al guardar compra');
      const creado = await resp.json();

      // guardar detalles
      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetallescompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_compra: creado.id_compra, id_producto: d.id_producto, cantidad: d.cantidad, precio_unitario: d.precio_unitario })
        });
      }

      // recargar
      await obtenerCompras();
      cerrarModalRegistro();
    } catch (error) {
      console.error(error);
      alert('Error al crear compra.');
    }
  };

  // ===== Edición
  const abrirModalEdicion = async (compra) => {
    setCompraAEditar(compra);
    setCompraEnEdicion({
      id_empleado: compra.id_empleado,
      fecha_compra: new Date(compra.fecha_compra).toISOString().split('T')[0]
    });uj

    const resp = await fetch('http://localhost:3000/api/detallescompras');
    const todos = await resp.json();
    const detallesRaw = todos.filter(d => d.id_compra === compra.id_compra);
    const detalles = await Promise.all(detallesRaw.map(async (d) => ({
      id_producto: d.id_producto,
      nombre_producto: await obtenerNombreProducto(d.id_producto),
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario
    })));

    setDetallesNuevos(detalles);
    setMostrarModalEdicion(true);
  };

  const actualizarCompra = async () => {
    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
    try {
      // actualizar compra
      await fetch(`http://localhost:3000/api/actualizarcompra/${compraAEditar.id_compra}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...compraEnEdicion, total_compra: total })
      });

      // eliminar detalles antiguos y volver a insertar (sencillo)
      const respDetalles = await fetch('http://localhost:3000/api/detallescompras');
      const todos = await respDetalles.json();
      const actuales = todos.filter(d => d.id_compra === compraAEditar.id_compra);
      for (const a of actuales) {
        await fetch(`http://localhost:3000/api/eliminarDetallesCompra/${a.id_detalle_compra}`, { method: 'DELETE' });
      }

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/detallescompras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_compra: compraAEditar.id_compra, id_producto: d.id_producto, cantidad: d.cantidad, precio_unitario: d.precio_unitario })
        });
      }

      await obtenerCompras();
      cerrarModalEdicion();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar compra.');
    }
  };

  // ===== Eliminación
  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminar(true);
  };

  const eliminarCompra = async () => {
    try {
      await fetch(`http://localhost:3000/api/compras/${compraAEliminar.id_compra}`, { method: 'DELETE' });
      await obtenerCompras();
      setMostrarModalEliminar(false);
    } catch (error) {
      console.error(error);
      alert('Error al eliminar compra.');
    }
  };

  // ===== Limpieza modales
  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
  setNuevaCompra({ id_empleado: '', fecha_compra: hoy, total_compra: 0 });
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setCompraAEditar(null);
    setCompraEnEdicion(null);
    setDetallesNuevos([]);
  };

  useEffect(() => {
    obtenerCompras();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Compras</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModalRegistro(true)}>
            + Nueva Compra
          </Button>
        </Col>
      </Row>

      <TablaCompras
        compras={comprasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesCompra}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={comprasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroCompra
        mostrar={mostrarModalRegistro}
        setMostrar={cerrarModalRegistro}
        nuevaCompra={nuevaCompra}
        setNuevaCompra={setNuevaCompra}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        empleados={empleados}
        productos={productos}
        agregarCompra={agregarCompra}
        hoy={hoy}
      />

      <ModalEdicionCompra
        mostrar={mostrarModalEdicion}
        setMostrar={cerrarModalEdicion}
        compra={compraAEditar}
        compraEnEdicion={compraEnEdicion}
        setCompraEnEdicion={setCompraEnEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        empleados={empleados}
        productos={productos}
        actualizarCompra={actualizarCompra}
      />

      <ModalEliminacionCompra
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        compra={compraAEliminar}
        confirmarEliminacion={eliminarCompra}
      />

      <ModalDetallesCompra
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesCompra}
      />
    </Container>
  );
};

export default Compras;