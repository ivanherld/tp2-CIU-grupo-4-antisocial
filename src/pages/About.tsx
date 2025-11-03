import { Container } from "react-bootstrap";

export default function About() {
  return (
    <>
      <Container className="py-5" style={{ maxWidth: 900, margin:"0 auto"}}>
        <h1 className="mb-3" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "700", color: "#3b82f6"}}>Acerca de Unahur Anti-Social Net</h1>
        <div style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif", color:"#555", fontSize: "1rem"}}>
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
        </div>
      </Container>
    </>
  );
}
