import { useContext, useState, type FormEvent } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container, InputGroup} from "react-bootstrap"
import api from '../api';
import type { LoginResponse } from '../types/Usuario';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';


//falta jwt y ver como seria con el backend
interface LoginProps {
  onLoginSuccess: () => void;
}


export default function FormLogin({ onLoginSuccess }: LoginProps) {
    const [validated, setValidated] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const {setUsuario} = useContext(AuthContext)
    const navigate = useNavigate()
    const { login } = useAuth();

    const loguear = async (e: FormEvent <HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        login({username});
        if(form.checkValidity() === false) {
          e.stopPropagation()
          setValidated(true)
          return
        } 
        setError("");
        setValidated(true)
        console.log("antes del try");

        try {
            const res = await api.post<LoginResponse>("/auth/login", {
                username,
                password
            });
            localStorage.setItem("token", res.data.token);
            onLoginSuccess();
            const user = {username};
            setUsuario(user);
            navigate("/feed");
            console.log("Login exitoso");
        } catch (err: any) {
            setError("Error al iniciar sesión. Verifica tus credenciales.");
        }
    }

  const estilo = {fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}

  return (
    <Container className="p-0 mt-4">
        <Form noValidate validated={validated} onSubmit={loguear}>
            <Form.Group className="mb-4" controlId="formBasicUsername">
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
                      Ingresa tu usuario.
                    </Form.Control.Feedback>      
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label style={estilo}>Contraseña</Form.Label>
                <Form.Control
                    type="password"
                    placeholder='Ingresa tu contraseña'
                    onChange={(e) => {setPassword(e.target.value); if(error) setError("")}}
                    value = {password}
                    isInvalid={!!error}
                    required
                />
                {!error && (
                  <Form.Control.Feedback type="invalid" style={estilo}>
                    Ingresa tu contraseña.
                  </Form.Control.Feedback>
                )}

                {error && ( <Form.Text className='text-danger' style={estilo}>{error}</Form.Text>)}
            
            </Form.Group>
            <div className="d-grid gap-2 mb-2">
                <Button variant="primary" type="submit" style={estilo}>Iniciar sesión</Button>
            </div>
        </Form>
    </Container>
  )
}

