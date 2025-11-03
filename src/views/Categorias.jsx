import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCategorias from "../components/categorias/TablaCategorias";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";

const Categorias = () => {

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: '',
    descripcion_categoria: ''
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };


  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre_categoria.trim()) return;

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCategoria)
      });

      if (!respuesta.ok) throw new Error('Error al guardar');

      // Limpiar y cerrar
      setNuevaCategoria({ nombre_categoria: '', descripcion_categoria: '' });
      setMostrarModal(false);

      await obtenerCategorias(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert("No se pudo guardar la categoría. Revisa la consola.");
    }
  };


  const obtenerCategorias = async () => {

    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) {
        throw new Error('Error al obtener las categorías');
      }

      const datos = await respuesta.json();

      setCategorias(datos);
      setCategoriasFiltradas(datos);
      setCargando(false);


    } catch (error) {
      console.log(error.message);
      setCargando(false);

    }
  }

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase(); // Obtiene el texto del input y lo pasa a minúsculas
    setTextoBusqueda(texto); // Actualiza el estado con el texto de búsqueda

    const filtradas = categorias.filter(
      (categoria) =>
        categoria.nombre_categoria.toLowerCase().includes(texto) ||
        categoria.descripcion_categoria.toLowerCase().includes(texto)
    );

    setCategoriasFiltradas(filtradas); // Actualiza el estado con las categorías filtradas
  };


  useEffect(() => {
    obtenerCategorias();
  }, []);


  return (
    <>
      <Container className="mt-4">
        <h4>Categorias</h4>

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
              + Nueva Categoría
            </Button>
          </Col>

        </Row>


        <TablaCategorias
          categorias={categoriasFiltradas}
          cargando={cargando}
        />
        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejarCambioInput={manejarCambioInput}
          agregarCategoria={agregarCategoria}
        />

      </Container>
    </>
  );
}
export default Categorias;