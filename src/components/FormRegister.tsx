import { useState, useContext, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { AuthContext } from '../context/AuthContext';
import { Container } from 'react-bootstrap';


export default function FormRegister() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { setUsuario } = useContext(AuthContext); // opcional, si quieres autologear
  const navigate = useNavigate();

  const guardarUsuariosEnLocalStorage = (usuarios: any[]) => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  };

  const obtenerUsuariosDesdeLocalStorage = () => {
    const raw = localStorage.getItem('usuarios');
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const registrar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    //* No se si dejarlas, porque esta el middleware en el backend, pero no se 

    if (username.length < 3) {
    setError('El nombre de usuario debe tener al menos 3 caracteres.');
    return;
    }

    if (password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    const usuarios = obtenerUsuariosDesdeLocalStorage();
    const existeUsuario = usuarios.find((u: any) => u.username === username);
    const existeEmail = usuarios.find((u: any) => u.email === email);
    if (existeUsuario) {
      setError('El nombre de usuario ya existe.');
      return;
    }
    if (existeEmail) {
      setError('El email ya está en uso.');
      return;
    }

    //*Guarda nuevo usuario, pero después implementamos el backend
    const nuevoUsuario = { username, email, password };
    usuarios.push(nuevoUsuario);
    guardarUsuariosEnLocalStorage(usuarios);

    //* Con esto, no le pedimos que inicie sesión después de registrarse, pero podríamos
    const currentUser = { username };
    setUsuario && setUsuario(currentUser);
    localStorage.setItem('usuario', JSON.stringify(currentUser));

    
    navigate('/feed');
  };
 
  const estilo = {fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}


    return(

        
    <Container className="p-0 mt-4">
      <Form noValidate validated={validated} onSubmit={registrar}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" className="mb-4" controlId="registerUsername">
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

          <Form.Group as={Col} md="6" className="mb-4" controlId="registerEmail">
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
          <Form.Group as={Col} md="6" className="mb-4" controlId="registerPassword">
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

          <Form.Group as={Col} md="6" className="mb-4" controlId="registerConfirmPassword">
            <Form.Label style={estilo}>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repite la contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!error && (error.includes('contraseña') || error.includes('coinciden'))}
            />
            <Form.Control.Feedback type="invalid" style={estilo}>
              Las contraseñas deben coincidir.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {error && <div className="text-danger mb-3">{error}</div>}

        <div className="d-grid gap-2 mb-2">
          <Button variant="primary" type="submit" style={estilo}>Registrar</Button>
        </div>
      </Form>
    </Container>
  );
}

