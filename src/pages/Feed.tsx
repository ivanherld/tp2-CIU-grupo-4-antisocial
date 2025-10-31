import { useAuth } from "../context/AuthProvider";
import { Button, Container } from "react-bootstrap";


function Feed() {
  const { usuario, logout } = useAuth();

  return (
    <main>
      <h1>Feed</h1>
      {usuario && (
        <Container>
          <h2>Bienvenido, {usuario.username}!</h2>
          <Button variant="danger" onClick={logout}>
            Cerrar sesión
          </Button>
        </Container>
      )}
    </main>
  )
}

export default Feed
