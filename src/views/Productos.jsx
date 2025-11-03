import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TablaProductos from "../components/productos/TablaProductos";

const productos = () => {
  const [productos, setproductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos");
      }

      const datos = await respuesta.json();
      setproductos(datos);
      setCargando(false);
    } catch (error) {
      console.log(error.message);
      setCargando(false);
    }
  };
  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <>
      <Container className="mt-4">
        <h4>Productos</h4>
        <TablaProductos 
        productos={productos} 
        cargando={cargando} 
        />
      </Container>
    </>
  );
};
export default productos;