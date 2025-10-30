import { useContext, useState, type FormEvent } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container} from "react-bootstrap"
import api from '../api';
import type { LoginResponse } from '../types/Usuario';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


//falta jwt y ver como seria con el backend
interface LoginProps {
  onLoginSuccess: () => void;
}


export default function FormLogin({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const {setUsuario} = useContext(AuthContext)
    const navigate = useNavigate()

    const loguear = async (e: FormEvent <HTMLFormElement>) => {
        e.preventDefault() 
        setError("");
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
            console.error('Login error (full object):', err);
  // Axios when server responded has err.response
  if (err.response) {
    console.error('Response status:', err.response.status);
    console.error('Response data:', err.response.data);
  } else if (err.request) {
    console.error('No response received, request was:', err.request);
  } else {
    console.error('Error message:', err.message);
  }
            setError("Error al iniciar sesión. Verifica tus credenciales.");
        }
    }


  return (
    <Container className="p-0 mt-5">
        <Form onSubmit={loguear}>
            <Form.Group className="mb-4" controlId="formBasicUsername">
                <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Nombre de usuario</Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu usuario" onChange={(e) => {setUsername(e.target.value)}} value={username} required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Contraseña</Form.Label>
                <Form.Control
                    type="password"
                    placeholder='Ingresa tu contraseña'
                    onChange={(e) => setPassword(e.target.value)}
                    value = {password}
                    isInvalid={!!error}
                    required
                />
                {error && ( <Form.Text className='text-danger'>{error}</Form.Text>)}
            </Form.Group>
            <div className="d-grid gap-2 mb-2">
                <Button variant="primary" type="submit" style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Iniciar sesión</Button>
            </div>
        </Form>
    </Container>
  )
}
