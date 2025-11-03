import { Container, Form, Button } from "react-bootstrap";
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
      <Container className="d-flex flex-column align-items-center py-5">
        <h1 className="mb-3" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "700", color: "#3b82f6", textAlign:"center" }}>Ayuda</h1>
        <p style={{fontFamily:"Open Sans, Arial, Helvetica, sans-serif", textAlign:"center"}}>¿Tenés dudas o sugerencias? Escribinos y te respondemos a la brevedad.</p>

        {!sent ? (
          <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 560, fontFamily:"Open Sans, Arial, Helvetica, sans-serif" }}>
            <Form.Group className="mb-3" >
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
            <div className="d-grid gap-2 mb-2">
              <Button type="submit" style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Enviar</Button>
            </div>
          </Form>
        ) : (
          <div className="alert alert-success" role="alert" style={{fontFamily:"Open Sans, Arial, Helvetica, sans-serif"}}>
            ¡Gracias! Tu mensaje fue enviado (demo). Te contactaremos por email.
          </div>
        )}
      </Container>
    </>
  );
}
