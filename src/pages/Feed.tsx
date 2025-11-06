import { useEffect, useState, useMemo } from "react";
import { Container, Spinner, Button, ButtonGroup } from "react-bootstrap";
import Masonry from 'react-masonry-css';
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
  const { usuario, cargando, isFollowing } = useAuth();
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

  // toggle showing only posts from followed users
  function handleShow() {
    if (!usuario) {
      navigate('/login');
      return;
    }
    setFollowedOnly(prev => !prev);
  }

  // Feed state: fetch global posts from backend GET /post and normalize to PostProps
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [followedOnly, setFollowedOnly] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [suggestedUsuarios, setSuggestedUsuarios] = useState<Usuario[]>([]);
  const [_loadingTags, setLoadingTags] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    const controllerPost = new AbortController();


    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (followedOnly) {
          // require authenticated user for followed feed
          if (!usuario?.id) {
            // no user: clear posts and stop
            if (!canceled) setPosts([]);
            return;
          }
          res = await api.get<any[]>(`/post/user/${encodeURIComponent(String(usuario.id))}/feed`, { signal: controllerPost.signal });
        } else {
          res = await api.get<any[]>('/post', { signal: controllerPost.signal });
        }
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
  }, [followedOnly, usuario?.id]);

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
  }, []);

  // derive suggested users by excluding those we already follow
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!usuarios || usuarios.length === 0) {
        if (!cancelled) setSuggestedUsuarios([]);
        return;
      }
      // build candidates excluding current user
      const candidates = usuarios.filter(u => u.id !== String(usuario?.id));
      try {
        const checks = await Promise.all(candidates.map(async (u) => {
          try {
            // isFollowing returns true if we already follow this user
            const res = await (typeof isFollowing === 'function' ? isFollowing(String(u.id)) : Promise.resolve(false));
            return { u, following: !!res };
          } catch (e) {
            return { u, following: false };
          }
        }));
        if (cancelled) return;
        const notFollowed = checks.filter(ch => !ch.following).map(ch => ch.u);
        setSuggestedUsuarios(notFollowed.slice(0, 3));
      } catch (e) {
        if (!cancelled) setSuggestedUsuarios([]);
      }
    })();
    return () => { cancelled = true; };
  }, [usuarios, usuario?.id]);

  // derive active tag from query string and compute filtered posts
  const activeTagRaw = searchParams.get('tag') ?? '';
  const activeTag = activeTagRaw.trim().replace(/^#/, '').toLowerCase();
  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) =>
      Array.isArray(p.tags) && p.tags.some((t) => String(t.nombre ?? '').toLowerCase() === activeTag)
    );
  }, [posts, activeTag]);
  
  
  const estiloBoton = {
    fontFamily:"Montserrat, Arial, Helvetica, sans-serif",
    whiteSpace: "nowrap",
    fontSize: "0.9rem",
  }
  
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
                
                  <ButtonGroup aria-label="feed-controls">
                <Button variant={followedOnly ? "success" : "outline-success"} onClick={handleShow} style={estiloBoton}>
                Mis Seguidos
                </Button>
                
                <Button variant="outline-success" onClick={() => handleLayOut()}>
                  {lgSlides === 3 ? <LayoutList /> : <LayoutGrid />}
                </Button>
                </ButtonGroup>
              </div>

              {/* Masonry layout to avoid gaps between variable-height cards */}
              <Masonry
                breakpointCols={{ default: lgSlides, 900: Math.max(1, Math.min(2, lgSlides)), 576: 1 }}
                className={styles["my-masonry-grid"]}
                columnClassName={styles["my-masonry-grid_column"]}
              >
                {filteredPosts.map((p) => (
                  <div key={p.id}>
                    <PostCard {...p} />
                  </div>
                ))}
              </Masonry>

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
                suggestedUsuarios.map((u) => (
                <SuggestCard
                  key={u.id}
                  id={u.id}
                  user = {{
                    name: u.username,
                    username: u.displayName,
                    avatar: u.avatarUrl,
                  }}
                  onFollowed={(id) => {
                    setUsuarios(prev => prev.filter(x => x.id !== String(id)));
                    setSuggestedUsuarios(prev => prev.filter(x => x.id !== String(id)));
                  }}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
