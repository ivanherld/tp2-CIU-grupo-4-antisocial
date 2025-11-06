import { useState, type FormEvent } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Container, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

interface LoginProps {
  onLoginSuccess?: () => void
}

export default function FormLogin({ onLoginSuccess }: LoginProps) {
  const [validated, setValidated] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const navigate = useNavigate()
  const { loginWithCredentials } = useAuth()

  const loguear = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setValidated(true)
    setError('')

    try {
      await loginWithCredentials(username, password)
      onLoginSuccess && onLoginSuccess()
      navigate('/feed')
    } catch (err: any) {
      setError('Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  const estilo = { fontFamily: 'Montserrat, Arial, Helvetica, sans-serif' }

  return (
    <Container className="p-0 mt-4">
      <Form noValidate validated={validated} onSubmit={loguear} style={estilo}>
        <Form.Group className="mb-4" controlId="formBasicUsername">
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
              Ingresa tu usuario.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            value={password}
            isInvalid={!!error}
            required
            style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
          />

          {!error && (
            <Form.Control.Feedback type="invalid">
              Ingresa tu contraseña.
            </Form.Control.Feedback>
          )}

          {error && (
            <Form.Text className="text-danger">
              {error}
            </Form.Text>
          )}
        </Form.Group>

        <div className="d-grid gap-2 mb-2">
          <Button variant="primary" type="submit">
            Iniciar sesión
          </Button>
        </div>
      </Form>
    </Container>
  )
}

