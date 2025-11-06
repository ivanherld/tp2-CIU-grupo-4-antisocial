import {Button, Container, Form, InputGroup, Offcanvas} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import {Search, House, User, X, LogOut, Moon, Sun } from 'lucide-react'
import styles from './FeedNav.module.css';
import CreatePostModal from '../CreatePostModal';
import logo from "../../assets/antisocialpng.png"
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';


function FeedNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const {logout} = useAuth()

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [offcanvasOpen, setOffcanvasOpen] = useState(false)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function doSearch() {
    const q = query.trim();
    if (!q) return;
    navigate(`/feed?tag=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setQuery("")
    setOffcanvasOpen(false)
  }

  function handleLogout() {
    logout()
    navigate("/")
    setOffcanvasOpen(false)
  }

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark");
    setOffcanvasOpen(false)
  }

  function handleNavClick(callback?: ()=>void) {
    if(callback) callback()
    setOffcanvasOpen(false)
  }

  return (
    <Navbar expand='lg' className="bg-body-tertiary" sticky='top'>
      <Container fluid className={styles.mainContainer}>
        <Navbar.Brand id={styles.navImg} as={NavLink} to='/feed'>
          <img src={logo} alt='UnaHur Anti-Social Net' style={{height:"50px", width:"auto"}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} onClick={() => setOffcanvasOpen(!offcanvasOpen)} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
          show={offcanvasOpen}
          onHide={() => setOffcanvasOpen(false)}
        >
          <Offcanvas.Header closeButton>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className={styles.navLinks}>
              <Nav.Link className={styles.navButton} as={NavLink} to='/feed' onClick={() => handleNavClick(scrollToTop)}>
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
              <Nav.Link className={styles.navButton} onClick={toggleTheme}>
                {theme === "dark" ? <Sun /> : <Moon />}
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </Nav.Link>
              <Nav.Link className={styles.navButton} onClick={handleLogout}>
                <LogOut />
                Cerrar sesión</Nav.Link>
            </Nav>
            <Container fluid className={styles.userContainer}>
              <CreatePostModal onClose={() => setOffcanvasOpen(false)} />
              <div className={styles.iconContainer}>
                <Nav.Link as={NavLink} to="/profile/me" onClick={() => setOffcanvasOpen(false)}>
                  <User className={styles.userIcon}/>
                </Nav.Link>
              </div>
            </Container>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>

  );
}

export default FeedNav;