import { Container } from "react-bootstrap";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Container style={{ maxWidth: 900, paddingTop: 24, paddingBottom: 48 }}>
        <h1>Términos y condiciones</h1>
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
