import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProductos from "../components/productos/TablaProductos";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto.jsx";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas.jsx";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const Productos = () => {
  const [productos, setproductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de productos por página

  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos");
      }

      const datos = await respuesta.json();
      setproductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.log(error.message);
      setCargando(false);
    }
  };


  const generarPDFProductos = () => {

    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51)
    doc.rect(0, 0, 220, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });


    const columnas = ["ID", "Nombre", "Descripción", "Categoría", "Precio", "Stock"];
    const filas = productosFiltrados.map((producto) => [
      producto.id_producto,
      producto.nombre_producto,
      producto.descripcion_producto,
      producto.id_categoria,
      `C$ ${producto.precio_unitario.toFixed(2)}`,
      producto.stock,
    ]);

    const totalPaginas = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth  : 'auto',
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
      },
      pageBreak: 'auto',
      rowPageBreak: 'auto',
      didDrawPage: function (data) {
        const alturaPagina  = doc.internal.pageSize.getHeight();
        const anchoPagina   = doc.internal.pageSize.getWidth();

        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      },
    });

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPaginas);
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);

  }

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = productos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion_producto.toLowerCase().includes(texto) ||
        producto.id_categoria == texto ||
        producto.precio_unitario == texto ||
        producto.stock == texto
    );
    setProductosFiltrados(filtrados);
  };

  // Estado y métodos para registro de producto (modal de creación)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    id_categoria: "",
    precio_unitario: "",
    stock: "",
    imagen: "",
  });

  // Calcular productos paginadas
  const productosPaginados = productosFiltrados.slice(
  (paginaActual - 1) * elementosPorPagina,
  paginaActual * elementosPorPagina
  );

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto.trim()) return;
    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarproducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });
      if (!respuesta.ok) throw new Error("Error al guardar producto");
      // Limpiar y cerrar
      setNuevoProducto({
        nombre_producto: "",
        descripcion_producto: "",
        id_categoria: "",
        precio_unitario: "",
        stock: "",
        imagen: "",
      });
      setMostrarModal(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo guardar el producto. Revisa la consola.");
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!productoEditado.nombre_producto.trim()) return;
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoEditado),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar producto");
      setMostrarModalEdicion(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`,
        {
          method: "DELETE",
        }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar producto");
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };



  useEffect(() => {
    obtenerProductos();
  }, []);

  

  return (
    <>
      <Container className="mt-4">
        <h4>Productos</h4>
        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col className="text-end">
            <Button className="color-boton-registro" onClick={() => setMostrarModal(true)}>
              + Nuevo Producto
            </Button>
          </Col>
          
        </Row>
        <TablaProductos
          productos={productosFiltrados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={productos.length} // Total de categorias
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
        />

        <ModalEdicionProducto
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          productoEditado={productoEditado}
          setProductoEditado={setProductoEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionProducto
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          producto={productoAEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />
      </Container>
      <Col lg={3} md={4} sm={4} xs={5} >
        <Button
          className="mb-3"
          onClick={generarPDFProductos}
          variant="secondary"
          style={{ width: '100%' }}
        >
          Generar PDF
        </Button>
      </Col>
    </>
  );
};
export default Productos;