import { Card, Image, Button, ListGroup, InputGroup, Form } from "react-bootstrap";
import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Home, Search, Moon, Sun, LogOut, X } from "lucide-react";
import styles from "./Sidebar.module.css";
import SearchModal from "./SearchModal";

function Sidebar({
  currentUser,
}: {
  currentUser?: { username?: string; displayName?: string; avatarUrl?: string } | null;
}) {
  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext);

  // Dark mode simple con Bootstrap 5.3
  const initialTheme = useMemo<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  }, []);
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Buscar por tag
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  // Detectar si estamos en mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function doSearch() {
    const q = query.trim();
    if (!q) return;
    navigate(`/feed?tag=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  }

  function handleSearchClick() {
    setSearchOpen(true);
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/");
  }

  const fuente = {fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}

  return (
    <>
      <div className={styles.sidebar}>
        <Card className={`mb-3 ${styles.profileCard}`}>
          <Card.Body className="d-flex align-items-center gap-2">
            <Image
              src={currentUser?.avatarUrl ?? "https://i.pravatar.cc/80?img=5"}
              roundedCircle
              width={56}
              height={56}
              alt="avatar"
            />
            <div>
              <div className="fw-semibold" style={fuente}>{currentUser?.displayName ?? "Tú"}</div>
              <div className="text-muted" style={fuente}>@{currentUser?.username ?? "usuario"}</div>
            </div>
          </Card.Body>
        </Card>

        <Card className={`mb-3 ${styles.menuCard}`}>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Button
                  variant="outline-secondary"
                  className="w-100 d-flex align-items-center justify-content-start gap-2"
                  onClick={() => navigate("/feed")}
                >
                  <Home size={18} />
                  <span>Inicio</span>
                </Button>
              </ListGroup.Item>

              <ListGroup.Item>
                {!isMobile && !searchOpen ? (
                  <Button
                    variant="outline-secondary"
                    className="w-100 d-flex align-items-center justify-content-start gap-2"
                    onClick={handleSearchClick}
                  >
                    <Search size={18} />
                    <span>Buscar por tag</span>
                  </Button>
                ) : !isMobile && searchOpen ? (
                  <InputGroup>
                    <Form.Control
                      placeholder="#tag"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && doSearch()}
                      autoFocus
                    />
                    <Button variant="primary" onClick={doSearch}>
                      <Search size={16} />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </InputGroup>
                ) : (
                  <Button
                    variant="outline-secondary"
                    className="w-100 d-flex align-items-center justify-content-start gap-2"
                    onClick={handleSearchClick}
                  >
                    <Search size={18} />
                    <span>Buscar por tag</span>
                  </Button>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  variant="outline-secondary"
                  className="w-100 d-flex align-items-center justify-content-start gap-2"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
                </Button>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button 
                  variant="outline-danger" 
                  className="w-100 d-flex align-items-center justify-content-start gap-2" 
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <small className={`text-muted d-block mt-3 ${styles.demoText}`}>Unahur Anti-Social • Demo</small>
      </div>

      {/* Modal de búsqueda para mobile */}
      <SearchModal show={isMobile && searchOpen} onHide={() => setSearchOpen(false)} />
    </>
  );
}

export default Sidebar;