import {Container, Offcanvas} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { Bell, MessageCircle, Search, House, User } from 'lucide-react'
import styles from '../styles/css/FeedNav.module.css';
import CreatePostModal from './CreatePostModal';


function FeedNav() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return (
    <>
      <Navbar collapseOnSelect expand='lg' className="bg-body-tertiary mb-3" sticky='top'>
        <Container fluid>
          <Navbar.Brand id={styles.navTitle} as={NavLink} to='/feed'>Anti-Social-Net</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                User Name and pic
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className={styles.navLinks}>
                <Nav.Link onClick={()=>scrollToTop()} className={styles.navButton} as={NavLink} to='/feed'>
                  <House />
                  Home
                </Nav.Link>
                <Nav.Link className={styles.navButton} as={NavLink} to='/feed'>
                  <Search />
                  Explorar
                </Nav.Link>
                <Nav.Link className={styles.navButton} as={NavLink} to='/feed'>
                  <Bell />
                  Notificaciones</Nav.Link>
                <Nav.Link className={styles.navButton} as={NavLink} to='/feed'>
                  <MessageCircle />
                  Mensajes
                </Nav.Link>
              </Nav>
              <Container fluid className={styles.userContainer}>
                <CreatePostModal />
                <div className={styles.iconContainer}>
                  <User className={styles.userIcon}/>
                </div>
              </Container>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default FeedNav;