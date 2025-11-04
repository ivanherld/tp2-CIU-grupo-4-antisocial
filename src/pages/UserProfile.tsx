import { useEffect, useState } from "react";
import Perfil from "../components/Perfil/Perfil";
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
  const currentUsername = "tucorreo";
  const isOwn = user.username === currentUsername;


  return (
  <div className={styles.content}>
    <Perfil
      user={user}
      counts={counts}
      posts={posts}
      isOwn={isOwn}
    />
  </div>
);
}
