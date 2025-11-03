import { Container } from "react-bootstrap";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Container style={{ maxWidth: 900, paddingTop: 24, paddingBottom: 48, paddingLeft: 16, paddingRight: 16 }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Términos y condiciones</h1>
        <p>
          Esta es una aplicación de ejemplo con fines educativos. No almacena datos reales
          ni ofrece garantías. El uso es bajo tu propia responsabilidad.
        </p>
        <ul>
          <li>No se comparten datos con terceros.</li>
          <li>Puede contener errores o comportamientos incompletos.</li>
          <li>El diseño y funcionalidades pueden cambiar sin previo aviso.</li>
        </ul>
      </Container>
      <Footer />
    </>
  );
}
