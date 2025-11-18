import React, { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaEmpleados = ({
  empleados,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  const [orden, setOrden] = useState({ campo: "id_empleado", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const empleadosOrdenados = [...empleados].sort((a, b) => {
    const valorA = a[orden.campo] ?? "";
    const valorB = b[orden.campo] ?? "";
    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }
    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <BotonOrden campo="id_empleado" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="primer_nombre" orden={orden} manejarOrden={manejarOrden}>
              Nombres
            </BotonOrden>
            <BotonOrden campo="primer_apellido" orden={orden} manejarOrden={manejarOrden}>
              Apellidos
            </BotonOrden>
            <BotonOrden campo="celular" orden={orden} manejarOrden={manejarOrden}>
              Celular
            </BotonOrden>
            <BotonOrden campo="cargo" orden={orden} manejarOrden={manejarOrden}>
              Cargo
            </BotonOrden>
            <BotonOrden campo="fecha_contratacion" orden={orden} manejarOrden={manejarOrden}>
              Fecha Contratación
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosOrdenados.map((emp) => (
            <tr key={emp.id_empleado}>
              <td>{emp.id_empleado}</td>
              <td>{emp.primer_nombre} {emp.segundo_nombre || ''}</td>
              <td>{emp.primer_apellido} {emp.segundo_apellido || ''}</td>
              <td>{emp.celular || '-'}</td>
              <td>{emp.cargo || '-'}</td>
              <td>{new Date(emp.fecha_contratacion).toLocaleString('es-NI', { timeZone: 'America/Managua', dateStyle: 'short' })}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(emp)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(emp)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaEmpleados;