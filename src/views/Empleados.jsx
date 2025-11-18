import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import TablaEmpleados from '../components/empleados/TablaEmpleados';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroEmpleado from '../components/empleados/ModalRegistroEmpleado';
import ModalEdicionEmpleado from '../components/empleados/ModalEdicionEmpleado';
import ModalEliminacionEmpleado from '../components/empleados/ModalEliminacionEmpleado';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [empleadoEditado, setEmpleadoEditado] = useState(null);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Fecha actual en formato YYYY-MM-DD (para input type="date")
  const hoy = new Date().toISOString().split('T')[0];

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    celular: '',
    cargo: '',
    fecha_contratacion: hoy
  });

  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado(prev => ({ ...prev, [name]: value }));
  };

  const agregarEmpleado = async () => {
    if (!nuevoEmpleado.primer_nombre.trim() || !nuevoEmpleado.primer_apellido.trim()) return;
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarempleado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEmpleado)
      });
      if (!respuesta.ok) throw new Error('Error al guardar');
      setNuevoEmpleado({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        celular: '',
        cargo: '',
        fecha_contratacion: hoy
      });
      setMostrarModal(false);
      await obtenerEmpleados();
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      alert("No se pudo guardar el empleado. Revisa la consola.");
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/empleados');
      if (!respuesta.ok) throw new Error('Error al obtener empleados');
      const datos = await respuesta.json();
      setEmpleados(datos);
      setEmpleadosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const generarPDFEmpleados = () => {
    const doc = new jsPDF();

    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text('Lista de Empleados', doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });

    const columnas = ['ID', 'Nombre', 'Celular', 'Cargo', 'Fecha Contratación'];
    const filas = empleadosFiltrados.map((emp) => [
      emp.id_empleado,
      `${emp.primer_nombre} ${emp.segundo_nombre} ${emp.primer_apellido} ${emp.segundo_apellido}`.replace(/\s+/g, ' ').trim(),
      emp.celular || '',
      emp.cargo || '',
      emp.fecha_contratacion || '',
    ]);

    const totalPaginas = '{total_pages_count_string}';

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
      },
      pageBreak: 'auto',
      rowPageBreak: 'auto',
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: 'center' });
      },
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPaginas);
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `empleados_${dia}${mes}${anio}.pdf`;
    doc.save(nombreArchivo);
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = empleados.filter(emp =>
      `${emp.primer_nombre} ${emp.segundo_nombre} ${emp.primer_apellido} ${emp.segundo_apellido}`.toLowerCase().includes(texto) ||
      emp.cargo.toLowerCase().includes(texto) ||
      emp.celular.includes(texto)
    );
    setEmpleadosFiltrados(filtrados);
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditado({ ...empleado }); // ← Carga fecha tal como está en BD
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!empleadoEditado.primer_nombre.trim() || !empleadoEditado.primer_apellido.trim()) return;
    try {
      // Normalizar fecha_contratacion a YYYY-MM-DD antes de enviar.
      const payload = { ...empleadoEditado };
      if (payload.fecha_contratacion) {
        const d = new Date(payload.fecha_contratacion);
        if (!isNaN(d)) {
          payload.fecha_contratacion = d.toISOString().split('T')[0];
        } else {
          // Fallback: ensure it's a string and take date part if possible
          payload.fecha_contratacion = String(payload.fecha_contratacion).split('T')[0];
        }
      }

      const respuesta = await fetch(`http://localhost:3000/api/actualizarempleado/${empleadoEditado.id_empleado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerEmpleados();
    } catch (error) {
      console.error("Error al editar empleado:", error);
      alert("No se pudo actualizar el empleado.");
    }
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarEmpleado/${empleadoAEliminar.id_empleado}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar');
      setMostrarModalEliminar(false);
      setEmpleadoAEliminar(null);
      await obtenerEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      alert("No se pudo eliminar el empleado. Puede estar en uso.");
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  return (
    <>
      <Container className="mt-4">
        <h4>Empleados</h4>
        <Row>
          <Col lg={5} md={6} sm={8} xs={12}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col className="text-end">
            <Button
              className='color-boton-registro'
              onClick={() => setMostrarModal(true)}
            >
              + Nuevo Empleado
            </Button>
          </Col>
        </Row>

        <TablaEmpleados
          empleados={empleadosPaginados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={empleados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

        <ModalRegistroEmpleado
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoEmpleado={nuevoEmpleado}
          manejarCambioInput={manejarCambioInput}
          agregarEmpleado={agregarEmpleado}
        />

        <ModalEdicionEmpleado
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          empleadoEditado={empleadoEditado}
          setEmpleadoEditado={setEmpleadoEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionEmpleado
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          empleado={empleadoAEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />
      </Container>
      <Col lg={3} md={4} sm={4} xs={5} >
        <Button
          className="mb-3"
          onClick={generarPDFEmpleados}
          variant="secondary"
          style={{ width: '100%' }}
        >
          Generar PDF
        </Button>
      </Col>
    </>
  );
};

export default Empleados;