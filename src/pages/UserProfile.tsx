import { useEffect, useState } from "react";
import Perfil from "../components/Perfil";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import styles from "./UserProfile.module.css";


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

// Datos mock
const mockUser: User = {
  id: "u1",
  username: "juanperez",
  displayName: "Juan Pérez",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  bio: "Estudiante de la UNAHUR. Me gusta programar y tomar mate.",
};

const mockPosts: Post[] = [
  {
    id: "p1",
    content: "Hoy programé mi primer proyecto con React + TypeScript 🎉",
    createdAt: new Date().toISOString(),
    author: mockUser,
    tags: [{ id: "t1", name: "react" }, { id: "t2", name: "typescript" }],
    comments: [
      {
        id: "c1",
        content: "¡Buenísimo! Felicitaciones :)",
        createdAt: new Date().toISOString(),
        author: {
          id: "u2",
          username: "ana",
          displayName: "Ana",
          avatarUrl: "https://i.pravatar.cc/150?img=32",
        },
      },
    ],
  },
  {
    id: "p2",
    content: "Les dejo un tip para debuggear componentes: usar React DevTools.",
    createdAt: new Date().toISOString(),
    author: mockUser,
    tags: [{ id: "t3", name: "tips" }],
    comments: [],
  },
];

export default function UserProfile() {
  useEffect(() => {
    document.title = `${mockUser.username} - Unahur Anti-Social Net`;
  }, []);

  const [user] = useState<User>(mockUser);
  const [counts, setCounts] = useState<FollowCounts>({ followers: 42, following: 10 });
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isFollowing, setIsFollowing] = useState(false);

  function handleFollowToggle() {
    setIsFollowing((s) => {
      const next = !s;
      setCounts((c) => ({ ...c, followers: c.followers + (next ? 1 : -1) }));
      return next;
    });
  }

  function handleAddComment(postId: string, content: string) {
    const newComment: Comment = {
      id: Math.random().toString(36).slice(2, 9),
      content,
      createdAt: new Date().toISOString(),
      author: {
        id: "me",
        username: "tucorreo",
        displayName: "Tú",
      },
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p))
    );
  }

  return (
  <>
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar
          currentUser={{
            username: "tucorreo",
            displayName: "Tú",
            avatarUrl: "https://i.pravatar.cc/80?img=5",
          }}
        />
      </div>

      <div className={styles.content}>
        <Perfil
          user={user}
          counts={counts}
          posts={posts}
          currentUser={{ username: "tucorreo" }}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          onAddComment={handleAddComment}
        />
      </div>
    </div>

    <Footer />
  </>
);
}
