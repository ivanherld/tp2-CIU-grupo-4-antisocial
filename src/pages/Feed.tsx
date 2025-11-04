import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import type { Post as APIDataPost } from "../hooks/useInfinitePosts";
import PostCard, { type PostProps } from "../components/Post";
import styles from "./Feed.module.css"
import { TrendingCard } from "../components/TrendingCard/TrendingCard";
import { SuggestCard } from "../components/SuggestCard/SuggestCard";
import { CreatePost } from "../components/CreatePost/CreatePost";
import { TrendingUp, User, LayoutList, LayoutGrid } from 'lucide-react';
// import { useAuth } from "../context/AuthProvider";

export default function Feed() {
  // const { usuario, logout } = useAuth();
  const [lgSlides, setSlides] = useState(3);
  useEffect(() => {
    document.title = "Feed - Unahur Anti-Social Net";
  }, []);

  const apiBase = "https://jsonplaceholder.typicode.com/posts";
  const { posts, loading, error, hasMore, sentinelRef } = useInfinitePosts(apiBase, 10);

  function handleLayOut() {
    if (lgSlides >= 2) {
      setSlides(1)
    } else {
      setSlides(3)
    }
  }

  const trendingTopics = [
    { topic: "NaturalezaUrbana", posts: "12.5K" },
    { topic: "DesconectaParaConectar", posts: "8.9K" },
    { topic: "JardínComunitario", posts: "6.2K" },
    { topic: "TecnologíaVerde", posts: "5.1K" },
  ];

  const sugerenciasUsuarios = [
    {
      name: "Juan López",
      username: "@juanl",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    {
      name: "Sofía García",
      username: "@sofiag",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
    },
    {
      name: "Diego Torres",
      username: "@diegot",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    },
  ];

  return (
    <main>
      <div className={styles.contenedorPrincipal} id="filas">
        {/* <h1>Feed</h1>
        {usuario && (
          <Container>
            <h2>Bienvenido, {usuario.username}!</h2>
            <Button variant="danger" onClick={logout}>
              Cerrar sesión
            </Button>
          </Container>
        )} */}
        <div className={styles.contenedorSecundario} id={styles.columna1}>
          <CreatePost />
          <div className={styles.feedContainers}>
            <Container className="py-4">
              <div className={styles.feedControl}>
                <div className="titulo">
                  <h2 className="mb-3" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight:"700", color:"#5fa92c"}}>Últimos posteos</h2>
                </div>
                <div className="boton">
                  <Button variant="outline-success" onClick={() => handleLayOut()}>
                    {lgSlides === 3 ? <LayoutList /> : <LayoutGrid />}
                  </Button>
                </div>
              </div>

              <Row xs={1} md={2} lg={lgSlides} className="g-3">
                {posts.map((p: APIDataPost) => {
                  const author = `user${p.userId ?? "unknown"}`;
                  const content = `${p.title}\n\n${p.body}`;
                  const postProps: PostProps = {
                    author,
                    avatarUrl: "/assets/antisocialpng.png",
                    date: undefined,
                    content,
                    comments: [],
                    id: ""
                  };

                  return (
                    <Col key={p.id}>
                      <PostCard {...postProps} />
                    </Col>
                  );
                })}
              </Row>

              <div className="text-center my-3" aria-live="polite" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight:"600", color:"#3b82f6"}}>
                {loading && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                )}
                {!loading && !hasMore && posts.length > 0 && (
                  <div className="text-muted mt-2">No hay más publicaciones.</div>
                )}
                {!loading && posts.length === 0 && !error && (
                  <div className="text-muted mt-2">No hay publicaciones todavía.</div>
                )}
                {error && <div className="text-danger mt-2">Error: {error}</div>}
              </div>

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <div ref={sentinelRef as any} style={{ height: 1 }} />
            </Container>
          </div>
        </div>
        <div className={styles.contenedorSecundario} id={styles.columna2}>
          <aside className={styles.contenidoAdicional}>
            <div className={styles.feedContainers} id="tendencias">
              <div className="titulo">
                <TrendingUp className="trendingIcon" />
                <h3 style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight:"600", color:"#3b82f6"}}>Tendencias</h3>
              </div>
              {trendingTopics.map((item, index) => (
                <TrendingCard
                  key={index}
                  topic={item.topic}
                  posts={item.posts}
                />
              ))}
            </div>
            <div className={styles.feedContainers} id="sugerencias">
              <div className="titulo">
                <User className="trendingIcon" />
                <h3 style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight:"600", color:"#3b82f6"}}>Sugerencias</h3>
              </div>
              {sugerenciasUsuarios.map((user, index) => (
                <SuggestCard
                  key={index}
                  user={user}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

