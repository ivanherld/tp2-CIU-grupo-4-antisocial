import { Container, Form, Button } from "react-bootstrap";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Help() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simula envío
    setSent(true);
  }

  return (
    <>
      <Container style={{ maxWidth: 900, paddingTop: 24, paddingBottom: 48 }}>
        <h1>Ayuda</h1>
        <p>¿Tenés dudas o sugerencias? Escribinos y te respondemos a la brevedad.</p>

        {!sent ? (
          <Form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
            <Form.Group className="mb-3">
              <Form.Label>Tu email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                required
                placeholder="Contanos qué pasó..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Button type="submit">Enviar</Button>
          </Form>
        ) : (
          <div className="alert alert-success" role="alert">
            ¡Gracias! Tu mensaje fue enviado (demo). Te contactaremos por email.
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
}
