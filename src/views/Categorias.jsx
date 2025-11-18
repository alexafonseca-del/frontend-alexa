import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCategorias from "../components/categorias/TablaCategorias";
import CuadroBusquedas from "../components/busquedas/cuadroBusquedas";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  // 🔹 Manejar input del registro
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Agregar nueva categoría
  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre_categoria.trim()) return;

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarcategoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCategoria),
      });

      if (!respuesta.ok) throw new Error("Error al guardar");

      // Limpiar y cerrar modal
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);

      await obtenerCategorias();
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert("No se pudo guardar la categoría. Revisa la consola.");
    }
  };

  // 🔹 Obtener todas las categorías
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/categorias");
      if (!respuesta.ok) {
        throw new Error("Error al obtener las categorías");
      }

      const datos = await respuesta.json();
      setCategorias(datos);
      setCategoriasFiltradas(datos);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setCargando(false);
    }
  };

  const generarPDFCategorias = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Categorías", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Nombre", "Descripción"];
    const filas = categoriasFiltradas.map((cat) => [
      cat.id_categoria,
      cat.nombre_categoria,
      cat.descripcion_categoria
    ]);

    const totalPaginas = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: 'auto',
      pageBreak: 'auto',
      rowPageBreak: 'auto',
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();

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
    const nombreArchivo = `categorias_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  }

  // 🔹 Filtrar por texto
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = categorias.filter(
      (categoria) =>
        categoria.nombre_categoria.toLowerCase().includes(texto) ||
        categoria.descripcion_categoria.toLowerCase().includes(texto)
    );

    setCategoriasFiltradas(filtradas);
  };

  // 🔹 Guardar edición
  const guardarEdicion = async () => {
    if (!categoriaEditada?.nombre_categoria.trim()) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarcategoria/${categoriaEditada.id_categoria}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoriaEditada),
        }
      );

      if (!respuesta.ok) throw new Error("Error al actualizar");

      setMostrarModalEdicion(false);
      await obtenerCategorias();
    } catch (error) {
      console.error("Error al editar categoría:", error);
      alert("No se pudo actualizar la categoría.");
    }
  };

  // 🔹 Abrir modal de eliminación
  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminar(true);
  };

  // 🔹 Confirmar eliminación
  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarcategoria/${categoriaAEliminar.id_categoria}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) throw new Error("Error al eliminar");

      setMostrarModalEliminar(false);
      setCategoriaAEliminar(null);
      await obtenerCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  // 🔹 Abrir modal de edición
  const abrirModalEdicion = (categoria) => {
    setCategoriaEditada({ ...categoria });
    setMostrarModalEdicion(true);
  };

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <>
    <Container className="mt-4">
      <h4>Categorías</h4>

      <Row>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            + Nueva Categoría
          </Button>
        </Col>
      </Row>

      <TablaCategorias
        categorias={categoriasFiltradas}
        cargando={cargando}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
      />

      {/* Modal de registro */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejarCambioInput={manejarCambioInput}
        agregarCategoria={agregarCategoria}
      />

      {/* Modal de edición */}
      <ModalEdicionCategoria
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        categoriaEditada={categoriaEditada}
        setCategoriaEditada={setCategoriaEditada}
        guardarEdicion={guardarEdicion}
      />

      {/* Modal de eliminación */}
      <ModalEliminacionCategoria
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        categoria={categoriaAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
    </Container>
    <Col lg={3} md={4} sm={4} xs={5} >
        <Button
          className="mb-3"
          onClick={generarPDFCategorias}
          variant="secondary"
          style={{ width: '100%' }}
        >
          Generar PDF
        </Button>
      </Col>
    </>
  );
};

export default Categorias;
