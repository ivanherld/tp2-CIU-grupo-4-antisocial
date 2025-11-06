import { useEffect, useState } from "react";
import Perfil from "../components/Perfil/Perfil";
import styles from "./UserProfile.module.css";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useParams, useLocation } from "react-router";
import api from "../api";
import axios from "axios";



type User = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
};
type Tag = { id: string; nombre: string };
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

  const { usuario: authUser, setUsuario, follow, unfollow, isFollowing: authIsFollowing } = useAuth();
  const { username: paramUsername } = useParams<{ username?: string }>();
  const location = useLocation() as unknown as {
    state?: { initialProfile?: User };
  };
  const navigate = useNavigate();

  const initialFromLocation = location.state?.initialProfile;

  
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

  

  const currentUsername = authUser?.username;
  const isOwn = !!(
    profile &&
    currentUsername &&
    profile.username.toLowerCase() === currentUsername.toLowerCase()
  );

  useEffect(() => {
    let canceled = false;

    
    const fetchPostsForUser = async (
      uid: string,
      signal?: AbortSignal
    ): Promise<void> => {
      setLoadingPosts(true);
      try {
        const postsRes = await api.get<any[]>(
          `/user/${encodeURIComponent(uid)}/posts`,
          { signal }
        );
        if (canceled) return;
        const apiPosts = Array.isArray(postsRes.data) ? postsRes.data : [];
        
        const normalized = apiPosts.map((p: any) => ({
          id: String(p.id),
          content: p.texto ?? "",
          createdAt: p.createdAt ?? p.createdAt,
          author: {
            id: String(p.usuarioId ?? p.usuario?.id ?? ""),
            username: p.usuario?.username ?? (p.usuarioUsername ?? ""),
          },
          tags: Array.isArray(p.tags)
            ? p.tags.map((t: any) => ({ id: String(t.id), nombre: t.nombre }))
            : [],
          comments: Array.isArray(p.comentarios)
            ? p.comentarios.map((c: any) => ({
                id: String(c.id),
                content: c.texto ?? c.content ?? "",
                createdAt: c.createdAt,
                author: {
                  id: String(c.usuarioId ?? c.usuario?.id ?? ""),
                  username: c.usuario?.username ?? "",
                },
              }))
            : [],
            imagenes: Array.isArray(p.imagenes)
              ? p.imagenes.map((img: any) => ({url: img.url}))
              : [],
        }));
        setPosts(normalized);
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
        console.warn("Error cargando posts del perfil", err);
        setPosts([]);
      } finally {
        if (!canceled) setLoadingPosts(false);
      }
    };

    
    if (!paramUsername) {
      if (!authUser) {
        navigate("/login");
        return;
      }
      setProfile(authUser as unknown as User);
      
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
          
          await fetchPostsForUser(uid);
        } catch (e) {
          console.warn("No se pudo cargar contadores del perfil propio", e);
        }
      })();
      setLoading(false);
      return;
    }

    
    if (
      authUser &&
      authUser.username.toLowerCase() === paramUsername.toLowerCase()
    ) {
      setProfile(authUser as unknown as User);
      
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

    
    if (
      initialFromLocation &&
      initialFromLocation.username.toLowerCase() === paramUsername.toLowerCase()
    ) {
      setProfile(initialFromLocation);
      setLoading(false);
      return;
    }

    
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

            
            if (authUser && authUser.id != null) {
              try {
                if (typeof authIsFollowing !== 'function') {
                  
                  console.error('AuthProvider isMissing isFollowing helper');
                  if (!canceled) setIsFollowing(false);
                } else {
                  const result = await authIsFollowing(userId);
                  if (!canceled) setIsFollowing(!!result);
                }
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
            
          (async () => {
            try {
              await fetchPostsForUser(userId, controller.signal);
            } catch (e) {
              console.warn('Error en fetchPostsForUser', e);
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

    
    if (String((authUser as any).id) === String((profile as any).id)) return;

    setFollowProcessing(true);
    const prevFollowing = isFollowing;
    setIsFollowing(!prevFollowing); 
    try {
      if (!prevFollowing) {
        if (typeof follow !== 'function') throw new Error('AuthProvider.follow is not available');
        await follow(String((profile as any).id));
      } else {
        if (typeof unfollow !== 'function') throw new Error('AuthProvider.unfollow is not available');
        await unfollow(String((profile as any).id));
      }

      
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

      
      if (authUser && authUser.id != null) {
        const followersRes = await api.get<User[]>(
          `/user/${encodeURIComponent(uid)}/seguidores`
        );
        const authIdStr = String((authUser as any).id);
        const nowFollowing = (followersRes.data || []).some(
          (u: User) => String((u as any).id) === authIdStr
        );
        setIsFollowing(nowFollowing);

        
        try {
          const meRes = await api.get<User>(`/auth/me`);
          setUsuario(meRes.data as any);
          localStorage.setItem("usuario", JSON.stringify(meRes.data));
        } catch (e) {
          
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
      
      setIsFollowing(prevFollowing);
      setFollowError("No se pudo completar la acción. Intenta de nuevo.");
      
      setTimeout(() => setFollowError(null), 5000);
    } finally {
      setFollowProcessing(false);
    }
  }


  if (loading) return <div style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600", color: "#3b82f6", textAlign: "center"}}>Loading...</div>;
  if (error) return <div className="text-danger" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600", textAlign: "center"}}>{error}</div>;
  if (!profile) return <div style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600", color: "#3b82f6", textAlign: "center"}}>No hay perfil para mostrar</div>;

  return (
  <div className={styles.content}>
    <Perfil
      user={profile}
      counts={counts}
      posts={posts}
      isFollowing={isFollowing}
      isOwn={isOwn}
      isProcessing={followProcessing}
      onFollowToggle={handleFollowToggle}
    />
    {loadingPosts && <div style={{ marginTop: 8, fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600", color: "#3b82f6", textAlign: "center"}}>Cargando publicaciones...</div>}
    {followError && (
      <div className="text-danger" style={{ marginTop: 8, fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight:"600"}}>
        {followError}
      </div>
    )}
  </div>
  );
}
