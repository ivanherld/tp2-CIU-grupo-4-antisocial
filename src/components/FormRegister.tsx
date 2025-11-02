import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { AuthContext } from "../context/AuthContext";
import { Container } from "react-bootstrap";
import api from "../api";
import type { LoginResponse } from "../types/Usuario";
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
  const { setUsuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const { login } = useAuth();

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

      //*Login inmediato
      const loginRes = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });

      if (loginRes?.data?.token) {
        localStorage.setItem("token", loginRes.data.token);
      }
      login({username});
      
      const user = { username };
      setUsuario(user);
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
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="6"
            className="mb-4"
            controlId="registerUsername"
          >
            <Form.Label style={estilo}>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Control.Feedback type="invalid" style={estilo}>
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
            <Form.Label style={estilo}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid" style={estilo}>
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
            <Form.Label style={estilo}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid" style={estilo}>
              Por favor ingresa una contraseña.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            className="mb-4"
            controlId="registerConfirmPassword"
          >
            <Form.Label style={estilo}>Confirmar contraseña</Form.Label>
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
            />
            <Form.Control.Feedback type="invalid" style={estilo}>
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
