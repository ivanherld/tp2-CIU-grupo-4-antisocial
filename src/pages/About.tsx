import { Container } from "react-bootstrap";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Container style={{ maxWidth: 900, paddingTop: 24, paddingBottom: 48, paddingLeft: 16, paddingRight: 16 }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>Acerca de Unahur Anti-Social Net</h1>
        <p>
          Este proyecto es una demo académica realizada por el <strong>Grupo 4 de CIU</strong>.
          La app muestra un perfil de usuario, un feed simple y navegación básica.
        </p>
        <p>
          Frontend construido con <strong>React + TypeScript + Vite</strong> y estilos
          con <strong>React Bootstrap</strong>. Íconos por <strong>lucide-react</strong>.
        </p>
        <p>
          El objetivo es practicar componentes, estado, rutas y layout responsive.
        </p>
      </Container>
      <Footer />
    </>
  );
}
