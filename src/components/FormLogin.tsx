import { useContext, useState, type ChangeEvent } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container} from "react-bootstrap"

import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';



export default function FormLogin() {
    const [nombre, setNombre] = useState("")
    const {setUsuario} = useContext(AuthContext)
    const navigate = useNavigate()

    const loguear = (e: ChangeEvent <HTMLFormElement>) => {
        e.preventDefault() 
        setUsuario({nombre})
        navigate("/feed")
    }

  return (
    <Container className="d-flex justify-content-center mt-5">
        <Form onSubmit={loguear}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control type="text" placeholder="Ingrese su nombre" onChange={(e) => {setNombre(e.target.value)}} value={nombre}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                    Login
            </Button>
        </Form>
    </Container>
  )
}
