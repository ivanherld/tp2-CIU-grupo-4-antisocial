import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import PostCard, { type PostProps } from "../components/Post";
import { type Tag } from "../components/Tags/Tags";
import api from "../api";
import styles from "./Feed.module.css"
import { TrendingCard } from "../components/TrendingCard/TrendingCard";
import { SuggestCard } from "../components/SuggestCard/SuggestCard";
import { TrendingUp, User, LayoutList, LayoutGrid } from 'lucide-react';
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";// import { useAuth } from "../context/AuthProvider";

type Usuario = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
};

export default function Feed() {
  const { usuario, cargando } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [lgSlides, setSlides] = useState(3);
  useEffect(() => {
    document.title = "Feed - Unahur Anti-Social Net";
  }, []);

  // Redirect to login if auth finished loading and there is no usuario
  useEffect(() => {
    if (!cargando && !usuario) {
      navigate('/login');
    }
  }, [cargando, usuario, navigate]);


  function handleLayOut() {
    if (lgSlides >= 2) {
      setSlides(1)
    } else {
      setSlides(3)
    }
  }

  // Feed state: fetch global posts from backend GET /post and normalize to PostProps
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    const controllerPost = new AbortController();


    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<any[]>('/post', { signal: controllerPost.signal });
        if (canceled) return;
        const apiPosts = Array.isArray(res.data) ? res.data : [];
        const normalized: PostProps[] = apiPosts.map((p: any) => ({
          id: p.id,
          author: p.usuario?.username ?? String(p.usuarioId ?? p.usuarioUsername ?? 'unknown'),
          authorId: String(p.usuario?.id ?? p.usuarioId ?? ''),
          avatarUrl: '/antisocialpng.png',
          date: p.createdAt ?? undefined,
          content: p.texto ?? p.content ?? (p.title ? `${p.title}\n\n${p.body}` : ''),
          tags: Array.isArray(p.tags)
            ? p.tags.map((t: any) => ({ id: String(t.id ?? t.nombre ?? t.name ?? ''), nombre: t.nombre ?? t.name ?? String(t) }))
            : [],
          comments: Array.isArray(p.comentarios)
            ? p.comentarios.map((c: any) => ({
              id: String(c.id),
              content: c.texto ?? c.content ?? '',
              createdAt: c.createdAt,
              author: {
                id: String(c.usuarioId ?? c.usuario?.id ?? ''),
                username: c.usuario?.username ?? '',
              },
            }))
            : [],
          imagenes: Array.isArray(p.imagenes)
            ? p.imagenes.map((img: any) => ({ url: img.url ?? img }))
            : [],
        }));
        // ordenar por fecha descendente si está disponible
        normalized.sort((a, b) => {
          const da = a.date ?? '';
          const db = b.date ?? '';
          if (da === db) return 0;
          return db > da ? 1 : -1;
        });
        setPosts(normalized);
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        console.warn('Error fetching feed posts', err);
        setError(err?.message || 'Error cargando publicaciones');
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      canceled = true;
      controllerPost.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let canceled = false;

    const fetchTag = async () => {
      setError(null);
      try {
        const res = await api.get<any[]>('/tag', { signal: controller.signal });
        if (canceled) return;
        const apiTags = Array.isArray(res.data) ? res.data : [];
        const normalizedTags: Tag[] = apiTags.map((t: any) => ({
          id: String(t.id),
          nombre: String(t.nombre) || '',
        }));
        setTags(normalizedTags);
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        console.warn('Error fetching tags', error);
        setError(err?.message || 'Error cargando etiquetas');
      } finally {
        if (!canceled) setLoadingTags(false);
      }
    }

    const fetchUsuarios = async () => {
      setError(null);
      try {
        const res = await api.get<any[]>('/user', { signal: controller.signal });
        if (canceled) return;
        const apiUser = Array.isArray(res.data) ? res.data : [];
        const normalizedUser: Usuario[] = apiUser.map((u: any) => ({
          id: String(u.id),
          username: u.username ?? "noUserName",
          displayName: u.displayName ?? "noDisplayName",
          avatarUrl: u.avatarUrl ?? "/antisocialpng.png",
        }));
        setUsuarios(normalizedUser);
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        console.warn('Error fetching tags', error);
        setError(err?.message || 'Error cargando etiquetas');
      } finally {
        if (!canceled) setLoadingTags(false);
      }
    }

    fetchTag();
    fetchUsuarios();
    return () => {
      canceled = true;
      controller.abort();
    };
  }, [tags, error]);

  // derive active tag from query string and compute filtered posts
  const activeTagRaw = searchParams.get('tag') ?? '';
  const activeTag = activeTagRaw.trim().replace(/^#/, '').toLowerCase();
  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) =>
      Array.isArray(p.tags) && p.tags.some((t) => String(t.nombre ?? '').toLowerCase() === activeTag)
    );
  }, [posts, activeTag]);
  
  /* 
  Mock data para tendencias y usuarios sugeridos 
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
  */
  
  return (
    <main>
      <div className={styles.contenedorPrincipal} id="filas">
        <div className={styles.contenedorSecundario} id={styles.columna1}>
          <div className={styles.feedContainers}>
            <Container className="py-4">
              <div className={styles.feedControl}>
                <div className="titulo">
                  <h2 className="mb-3" style={{ fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "700", color: "#5fa92c" }}>Últimos posteos</h2>
                </div>
                <Button variant="outline-success" onClick={() => handleLayOut()}>
                  {lgSlides === 3 ? <LayoutList /> : <LayoutGrid />}
                </Button>
              </div>

              <Row xs={1} md={lgSlides} lg={lgSlides} className="g-3">
                {filteredPosts.map((p) => (
                  <Col key={p.id}>
                    <PostCard {...p} />
                  </Col>
                ))}
              </Row>

              <div className="text-center my-3" aria-live="polite" style={{ fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600" }}>
                {loading && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                )}
                {!loading && filteredPosts.length === 0 && !error && (
                  <div className="text-muted mt-2">{activeTag ? `No hay publicaciones con #${activeTagRaw}` : 'No hay publicaciones todavía.'}</div>
                )}
                {!loading && filteredPosts.length > 0 && (
                  <div className="text-muted mt-2">{activeTag ? `Resultados para #${activeTagRaw}` : 'Publicaciones cargadas'}</div>
                )}
                {error && <div className="text-danger mt-2">Error: {error}</div>}
              </div>
            </Container>
          </div>
        </div>
        <div className={styles.contenedorSecundario} id={styles.columna2}>
          <aside className={styles.contenidoAdicional}>
            <div className={styles.feedContainers} id="tendencias">
              <div className="titulo">
                <TrendingUp className="trendingIcon" />
                <h3 style={{ fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600", color: "#3b82f6" }}>Tendencias</h3>
              </div>
              {
                tags
                .slice(0, 5)
                .map((t, index) => (
                <TrendingCard
                  key={index}
                  nombre ={t.nombre}
                />
              ))}
            </div>
            <div className={styles.feedContainers} id="sugerencias">
              <div className="titulo">
                <User className="trendingIcon" />
                <h3 style={{ fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600", color: "#3b82f6" }}>Sugerencias</h3>
              </div>
              {
                usuarios
                .filter(u => u.id !== String(usuario?.id))
                .slice(0, 3)
                .map((u, index) => (
                <SuggestCard
                  key={index}
                  user = {{
                    name: u.username,
                    username: u.displayName,
                    avatar: u.avatarUrl,
                  }
                }
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
