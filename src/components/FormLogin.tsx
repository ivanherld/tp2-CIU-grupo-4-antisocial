import { useContext, useState, type FormEvent } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container} from "react-bootstrap"

import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

//falta jwt y ver como seria con el backend

export default function FormLogin() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const {setUsuario} = useContext(AuthContext)
    const navigate = useNavigate()

    const loguear = (e: FormEvent <HTMLFormElement>) => {
        e.preventDefault() 
        if(password !== "123456") {
            setError("Contraseña incorrecta")
            return
        }
        setError("")
        const user = {username}
        setUsuario(user)
        localStorage.setItem("usuario", JSON.stringify(user))
        navigate("/feed")
    }


  return (
    <Container className="p-0 mt-5">
        <Form onSubmit={loguear}>
            <Form.Group className="mb-4" controlId="formBasicUsername">
                <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Nombre de usuario</Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu usuario" onChange={(e) => {setUsername(e.target.value)}} value={username} required/>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label htmlFor="inputPassword5" style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Contraseña</Form.Label>
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
