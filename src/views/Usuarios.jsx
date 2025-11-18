import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/busquedas/cuadroBusquedas";
import ModalRegistroUsuario from "../components/usuarios/ModalRegistroUsuario";
import ModalEdicionUsuario from "../components/usuarios/ModalEdicionUsuario";
import ModalEliminacionUsuario from "../components/usuarios/ModalEliminacionUsuario";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const Usuarios = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de productos por página

  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    contraseña: ''
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };


  const agregarUsuario = async () => {
    if (!nuevoUsuario.usuario.trim()) return;

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarusuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!respuesta.ok) throw new Error('Error al guardar');

      // Limpiar y cerrar
      setNuevoUsuario({ usuario: '', contraseña: '' });
      setMostrarModal(false);

      await obtenerUsuarios(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("No se pudo guardar el usuario. Revisa la consola.");
    }
  };


  const obtenerUsuarios = async () => {

    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios');
      if(!respuesta.ok) {
        throw new Error('Error al obtener los usuarios');
      }

      const datos = await respuesta.json();

      setUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargando(false);


    }catch (error) {
      console.log(error.message);
      setCargando(false);

    }
  }

  const generarPDFUsuarios = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Usuarios", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["ID", "Usuario"];
    const filas = usuariosFiltrados.map((u) => [
      u.id_usuario,
      u.usuario
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
    const nombreArchivo = `usuarios_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  }

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase(); // Obtiene el texto del input y lo pasa a minúsculas
    setTextoBusqueda(texto); // Actualiza el estado con el texto de búsqueda

    const filtradas = usuarios.filter(
      (usuario) =>
        usuario.usuario.toLowerCase().includes(texto) ||
        usuario.contraseña.toLowerCase().includes(texto)
    );

    setUsuariosFiltrados(filtradas); // Actualiza el estado con las categorías filtradas
  };


  // Calcular productos paginadas
  const usuariosPaginados = usuariosFiltrados.slice(
  (paginaActual - 1) * elementosPorPagina,
  paginaActual * elementosPorPagina
  );

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado({ ...usuario });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!usuarioEditado.usuario.trim()) return;
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarusuario/${usuarioEditado.id_usuario}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioEditado),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar producto");
      setMostrarModalEdicion(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al editar usuario:", error);
      alert("No se pudo actualizar el usuario.");
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eeliminarusuario/${usuarioAEliminar.id_usuario}`,
        {
          method: "DELETE",
        }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar usuario");
      setMostrarModalEliminar(false);
      setUsuarioAEliminar(null);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  } , []);

return (
    <>
      <Container className="mt-4">
        <h4>Usuarios</h4>

          <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col className="text-end">
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
            >
              + Nuevo Usuario
            </Button>
          </Col>

        </Row>

        <TablaUsuarios
          usuarios={usuariosPaginados} 
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={usuarios.length} // Total de categorias
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        <ModalRegistroUsuario
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoUsuario={nuevoUsuario}
          manejarCambioInput={manejarCambioInput}
          agregarUsuario={agregarUsuario}
        />

        <ModalEdicionUsuario
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          usuarioEditado={usuarioEditado}
          setUsuarioEditado={setUsuarioEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionUsuario
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          usuario={usuarioAEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />
      </Container>
      <Col lg={3} md={4} sm={4} xs={5} >
        <Button
          className="mb-3"
          onClick={generarPDFUsuarios}
          variant="secondary"
          style={{ width: '100%' }}
        >
          Generar PDF
        </Button>
      </Col>
    </>
  );
}
export default Usuarios;