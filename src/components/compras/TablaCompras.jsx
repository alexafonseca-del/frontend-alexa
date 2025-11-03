import {Table, Spinner} from "react-bootstrap";

const TablaCompras = ({compras, cargando}) => {

  if(cargando){
    return(
      <>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </Spinner>
      </>
    );
  }
  return(
    <>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>ID Empleado</th>
          <th>Fecha Compra</th>
          <th>Total Compra</th>
          <th>Acciones</th> 
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => {
          return(
            <tr key={compra.id_compra}>
              <td>{compra.id_compra}</td>
              <td>{compra.id_empleado}</td>
              <td>{compra.fecha_compra}</td>
              <td>{compra.total_compra}</td>
              <td>Acción</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
    </>
  );
}

export default TablaCompras;