import { useEffect, useState } from "react";
import Perfil from "../components/Perfil/Perfil";
import styles from "./UserProfile.module.css";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useParams, useLocation } from "react-router";
import api from "../api";
import axios from "axios";
import Footer from "../components/Footer/Footer";
import FeedNav from "../components/FeedNav/FeedNav";



type User = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
};
type Tag = { id: string; name: string };
type Comment = { id: string; content: string; createdAt: string; author: User };
type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  tags?: Tag[];
  comments?: Comment[];
};
type FollowCounts = { followers: number; following: number };

export default function UserProfile() {
  useEffect(() => {
    document.title = `Perfil - Unahur Anti-Social Net`;
  }, []);

  const { usuario: authUser, setUsuario } = useAuth();
  const { username: paramUsername } = useParams<{ username?: string }>();
  const location = useLocation() as unknown as {
    state?: { initialProfile?: User };
  };
  const navigate = useNavigate();

  const initialFromLocation = location.state?.initialProfile;

  // inicial: si no hay parámetro, usar el usuario autenticado; si hay parámetro, el initial viene del location o queda indefinido
  const initialProfile: User | undefined =
    initialFromLocation ??
    (paramUsername ? undefined : (authUser as unknown as User) ?? undefined);

  const [profile, setProfile] = useState<User | null>(initialProfile ?? null);
  const [counts, setCounts] = useState<FollowCounts>({
    followers: 0,
    following: 0,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followProcessing, setFollowProcessing] = useState(false);

  const [loading, setLoading] = useState<boolean>(!initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [followError, setFollowError] = useState<string | null>(null);

  // Simplificado: usar directamente las rutas confirmadas `/user/:id/...`.

  const currentUsername = authUser?.username;
  const isOwn = !!(
    profile &&
    currentUsername &&
    profile.username.toLowerCase() === currentUsername.toLowerCase()
  );

  useEffect(() => {
    let canceled = false;

    // Si no hay nombre de usuario en la ruta -> mostrar el usuario autenticado (o redirigir si no está logueado)
    if (!paramUsername) {
      if (!authUser) {
        navigate("/login");
        return;
      }
      setProfile(authUser as unknown as User);
      // también cargar contadores para el propio perfil
      (async () => {
        try {
          const uid = String((authUser as any).id);
          const [fCountRes, sCountRes] = await Promise.all([
            api.get<{ count: number }>(
              `/user/${encodeURIComponent(uid)}/seguidores/count`
            ),
            api.get<{ count: number }>(
              `/user/${encodeURIComponent(uid)}/seguidos/count`
            ),
          ]);
          setCounts({
            followers: fCountRes.data.count,
            following: sCountRes.data.count,
          });
        } catch (e) {
          console.warn("No se pudo cargar contadores del perfil propio", e);
        }
      })();
      setLoading(false);
      return;
    }

    // Si el parámetro coincide con el usuario autenticado, reutilizar el contexto
    if (
      authUser &&
      authUser.username.toLowerCase() === paramUsername.toLowerCase()
    ) {
      setProfile(authUser as unknown as User);
      // cargar contadores del propio perfil cuando se accede via username
      (async () => {
        try {
          const uid = String((authUser as any).id);
          const [fCountRes, sCountRes] = await Promise.all([
            api.get<{ count: number }>(
              `/user/${encodeURIComponent(uid)}/seguidores/count`
            ),
            api.get<{ count: number }>(
              `/user/${encodeURIComponent(uid)}/seguidos/count`
            ),
          ]);
          setCounts({
            followers: fCountRes.data.count,
            following: sCountRes.data.count,
          });
        } catch (e) {
          console.warn("No se pudo cargar contadores del perfil propio", e);
        }
      })();
      setLoading(false);
      return;
    }

    // Si tenemos un perfil inicial en location y coincide con el parámetro, usarlo
    if (
      initialFromLocation &&
      initialFromLocation.username.toLowerCase() === paramUsername.toLowerCase()
    ) {
      setProfile(initialFromLocation);
      setLoading(false);
      return;
    }

    // De lo contrario, solicitar el perfil al servidor
    const controller = new AbortController();
    setLoading(true);
    api
      .get<User>(`/user?username=${encodeURIComponent(paramUsername)}`, {
        signal: controller.signal,
      })
      .then((res) => {
        if (canceled) return;
        setProfile(res.data);
        setError(null);
        const userId = String(res.data.id);
        // usar las rutas de la API que devuelven contadores por id
        (async () => {
          try {
            const fRes = await api.get<{ count: number }>(
              `/user/${encodeURIComponent(userId)}/seguidores/count`,
              { signal: controller.signal }
            );
            const foRes = await api.get<{ count: number }>(
              `/user/${encodeURIComponent(userId)}/seguidos/count`,
              { signal: controller.signal }
            );
            if (canceled) return;
            setCounts({
              followers: fRes.data.count,
              following: foRes.data.count,
            });

            // determinar si authUser sigue a este perfil obteniendo la lista de seguidores
            if (authUser && authUser.id != null) {
              try {
                const listRes = await api.get<User[]>(
                  `/user/${encodeURIComponent(userId)}/seguidores`,
                  { signal: controller.signal }
                );
                if (canceled) return;
                const authIdStr = String((authUser as any).id);
                const isFollow = (listRes.data || []).some(
                  (u) => String((u as any).id) === authIdStr
                );
                setIsFollowing(isFollow);
              } catch (err) {
                if (axios.isAxiosError(err) && err.code === "ERR_CANCELED")
                  return;
                console.warn("No se pudo determinar isFollowing", err);
              }
            }
          } catch (err) {
            if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
            console.warn("No se pudo cargar contadores", err);
          }
        })();
          // cargar posts del perfil mostrado
          (async () => {
            setLoadingPosts(true);
            try {
              const postsRes = await api.get<Post[]>(`/post/${encodeURIComponent(userId)}`, { signal: controller.signal });
              if (canceled) return;
              setPosts(postsRes.data || []);
            } catch (err) {
              if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') return;
              console.warn('Error cargando posts del perfil', err);
              setPosts([]);
            } finally {
              if (!canceled) setLoadingPosts(false);
            }
          })();
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
        if (canceled) return;
        setProfile(null);
        setError("No se encontró el perfil o hubo un error");
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
      controller.abort();
    };
  }, [paramUsername, authUser, initialFromLocation, navigate]);

  async function handleFollowToggle() {
    if (followProcessing) return;
    if (!authUser || !profile) {
      navigate("/login");
      return;
    }

    // evitar seguirse a uno mismo
    if (String((authUser as any).id) === String((profile as any).id)) return;

    setFollowProcessing(true);
    const actorId = encodeURIComponent(String((authUser as any).id));
    const targetId = encodeURIComponent(String((profile as any).id));

    console.debug(
      "handleFollowToggle: actor",
      actorId,
      "target",
      targetId,
      "isFollowing",
      isFollowing
    );
    // UI optimista: invertir el estado local inmediatamente para una experiencia más rápida
    const prevFollowing = isFollowing;
    setIsFollowing(!prevFollowing);
    try {
      if (!prevFollowing) {
        console.debug("Sending follow request");
        await api.post(`/user/${actorId}/follow/${targetId}`);
      } else {
        console.debug("Sending unfollow request");
        await api.delete(`/user/${actorId}/unfollow/${targetId}`);
      }

      // refrescar contadores usando los endpoints del servidor (/user/:id/...)
      const uid = String((profile as any).id);
      const fCountRes = await api.get<{ count: number }>(
        `/user/${encodeURIComponent(uid)}/seguidores/count`
      );
      const sCountRes = await api.get<{ count: number }>(
        `/user/${encodeURIComponent(uid)}/seguidos/count`
      );
      setCounts({
        followers: fCountRes.data.count,
        following: sCountRes.data.count,
      });

      // actualizar isFollowing comprobando la lista de seguidores (/user/:id/seguidores)
      if (authUser && authUser.id != null) {
        const followersRes = await api.get<User[]>(
          `/user/${encodeURIComponent(uid)}/seguidores`
        );
        const authIdStr = String((authUser as any).id);
        const nowFollowing = (followersRes.data || []).some(
          (u: User) => String((u as any).id) === authIdStr
        );
        setIsFollowing(nowFollowing);

        // actualizar el perfil del usuario logueado (para que sus contadores/seguidos se actualicen)
        try {
          const meRes = await api.get<User>(`/auth/me`);
          setUsuario(meRes.data as any);
          localStorage.setItem("usuario", JSON.stringify(meRes.data));
        } catch (e) {
          // no bloquear la experiencia si falla la recarga del perfil local
          console.warn(
            "No se pudo actualizar el perfil local después de follow/unfollow",
            e
          );
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.warn("Follow/unfollow error", err);
      // revertir la actualización optimista
      setIsFollowing(prevFollowing);
      setFollowError("No se pudo completar la acción. Intenta de nuevo.");
      // borrar el mensaje de error de follow después de un breve retraso
      setTimeout(() => setFollowError(null), 5000);
    } finally {
      setFollowProcessing(false);
    }
  }

  function handleAddComment(postId: string, content: string) {
    const newComment: Comment = {
      id: Math.random().toString(36).slice(2, 9),
      content,
      createdAt: new Date().toISOString(),
      author: {
        id: authUser ? String((authUser as any).id ?? "me") : "me",
        username: authUser?.username ?? "anon",
        displayName: authUser?.username ?? "Tú",
      },
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!profile) return <div>No hay perfil para mostrar</div>;

  return (
    <>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <FeedNav />
        </div>

        <div className={styles.content}>
          <Perfil
            user={profile}
            counts={counts}
            posts={posts}
            isFollowing={isFollowing}
            isOwn={isOwn}
            isProcessing={followProcessing}
            onFollowToggle={handleFollowToggle}
            onAddComment={handleAddComment}
          />
          {loadingPosts && <div style={{ marginTop: 8 }}>Cargando publicaciones...</div>}
          {followError && (
            <div className="text-danger" style={{ marginTop: 8 }}>
              {followError}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
