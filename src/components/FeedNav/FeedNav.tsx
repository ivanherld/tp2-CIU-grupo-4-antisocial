import {Button, Container, Form, InputGroup, Offcanvas} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import {Search, House, User, X, LogOut } from 'lucide-react'
import styles from './FeedNav.module.css';
import CreatePostModal from '../CreatePostModal';
import logo from "../../assets/antisocialpng.png"
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';


function FeedNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const {logout} = useAuth()

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function doSearch() {
    const q = query.trim();
    if (!q) return;
    navigate(`/feed?tag=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setQuery("")
  }

  function handleLogout() {
    logout()
    navigate("/")
  }


  return (
    <Navbar collapseOnSelect expand='lg' className="bg-body-tertiary" sticky='top'>
      <Container fluid className={styles.mainContainer}>
        <Navbar.Brand id={styles.navImg} as={NavLink} to='/feed'>
          <img src={logo} alt='UnaHur Anti-Social Net' style={{height:"50px", width:"auto"}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className={styles.navLinks}>
              <Nav.Link onClick={()=>scrollToTop()} className={styles.navButton} as={NavLink} to='/feed'>
                <House />
                Home
              </Nav.Link>

              {!searchOpen ? (
                <Nav.Link className={styles.navButton} onClick={() => setSearchOpen(true)}>
                  <Search />
                  Buscar por tag
                </Nav.Link>
              ) : (
                <InputGroup style={{maxWidth: "250px"}}>
                  <Form.Control
                    placeholder="#tag"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doSearch()}
                    autoFocus
                  />
                  <Button variant="primary" onClick={doSearch}>
                    <Search size={16}/>
                  </Button>
                  <Button
                    variant='outline-secondary'
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("")
                    }}
                  >
                    <X size={16}/>
                  </Button>
                </InputGroup>
              )}
              <Nav.Link className={styles.navButton} onClick={handleLogout}>
                <LogOut />
                Cerrar sesión</Nav.Link>
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

  );
}

export default FeedNav;