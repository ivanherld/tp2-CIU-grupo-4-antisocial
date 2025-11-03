import { Container } from "react-bootstrap";



export default function Terms() {

  const estilos = {
    fontFamily: "Open Sans Arial, Helvetica, sans-serif",
    color: "#555",
    fontSize: "1rem"
  }

  return (
    <>
      <Container className="py-5" style={{ maxWidth: 900, margin:"0 auto"}}>
        <h1 className="mb-3" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "700", color: "#3b82f6" }}>Términos y condiciones</h1>
        <p style={estilos}>
          Esta es una aplicación de ejemplo con fines educativos. No almacena datos reales
          ni ofrece garantías. El uso es bajo tu propia responsabilidad.
        </p>
        <ul style={estilos}>
          <li>No se comparten datos con terceros.</li>
          <li>Puede contener errores o comportamientos incompletos.</li>
          <li>El diseño y funcionalidades pueden cambiar sin previo aviso.</li>
        </ul>
      </Container>
    </>
  );
}
