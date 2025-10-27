import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';


export default function Navbar() {
  return (
    <Nav className="justify-content-end" activeKey="/home" style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
        </Nav.Item>
      </Nav>
  )
}
