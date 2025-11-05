import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
// auth context not required here; using useAuth helper instead
import { Container } from "react-bootstrap";
import api from "../api";
import { useAuth } from '../context/AuthProvider';

interface NewUser {
  username: string;
  email: string;
  password: string;
}

export default function FormRegister() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");

    //*validación nativa de lform (Bootstrap)
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (password.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      //*Registramos en el backend
      const newUser: NewUser = { username, email, password };
      await api.post("/auth/register", newUser);

      //*Login inmediato usando el helper centralizado
      await loginWithCredentials(username, password);
      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const estilo = { fontFamily: "Montserrat, Arial, Helvetica, sans-serif" };

  return (
    <Container className="p-0 mt-4">
      <Form noValidate validated={validated} onSubmit={handleSubmit} style={estilo}>
        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="6"
            className="mb-4"
            controlId="registerUsername"
          >
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
              />
              <Form.Control.Feedback type="invalid">
                Elige un nombre de usuario.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            className="mb-4"
            controlId="registerEmail"
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingresa un email válido.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="6"
            className="mb-4"
            controlId="registerPassword"
          >
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingresa una contraseña.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            className="mb-4"
            controlId="registerConfirmPassword"
          >
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repite la contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={
                !!error &&
                (error.includes("contraseña") || error.includes("coinciden"))
              }
              style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
            />
            <Form.Control.Feedback type="invalid">
              Las contraseñas deben coincidir.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {error && <div className="text-danger mb-3">{error}</div>}

        <div className="d-grid gap-2 mb-2">
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            style={estilo}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}{" "}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
