import { useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import type { Post } from "../hooks/useInfinitePosts";
import CreatePostModal from "../components/CreatePostModal";

export default function Feed() {
  useEffect(() => {
    document.title = "Feed - Unahur Anti-Social Net";
  }, []);

  const apiBase = "https://jsonplaceholder.typicode.com/posts";
  const { posts, loading, error, hasMore, sentinelRef } = useInfinitePosts(apiBase, 10);

  return (
    <main>
      <CreatePostModal />
      <Container className="py-4">
        <h2 className="mb-3">Feed</h2>

        <Row xs={1} md={2} lg={3} className="g-3">
          {posts.map((p: Post) => (
            <Col key={p.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title style={{ fontSize: "1rem" }}>{p.title}</Card.Title>
                  <Card.Text style={{ fontSize: ".9rem" }}>{p.body}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">Post #{p.id}</Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center my-3" aria-live="polite">
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

        <div ref={sentinelRef as any} style={{ height: 1 }} />
      </Container>
    </main>
  );
}

