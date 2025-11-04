
import styles from "./Perfil.module.css";
import { Button, Col, Row } from "react-bootstrap";
import Post from "../Post";
import { useAuth } from "../../context/AuthProvider";

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

type PerfilProps = {
  user: User;
  counts?: FollowCounts | null;
  posts: Post[];
  currentUser?: { username?: string } | null;
  isOwn?: boolean;
};

export default function Perfil({
  user,
  counts,
  posts,
  isOwn,
}: PerfilProps) {
  const postsCount = posts?.length ?? 0;
  const {following, toggleFollow} = useAuth()
  const isFollowing = !!following[user.username]

  
  return (
    <main className={`px-4 px-md-5 ${styles.profile}`}>
      <header className={`mb-3 ${styles.header}`}>
        <Row className="align-items-center">

          <Col xs="auto" className={`d-flex flex-column align-items-center align-items-md-start ${styles.avatarCol}`}>
            <img
              className={styles.avatar}
              src={user.avatarUrl ?? "/default-avatar.png"}
              alt={`${user.username} avatar`}
            />
            <div className={`${styles.nameBlock}`}>
              <h1 className={styles.displayName}>
                {user.displayName ?? user.username}
              </h1>
              <p className={styles.username}>@{user.username}</p>
            </div>
          </Col>
        </Row>

            <Row className="w-100 d-flex justify-content-between flex-nowrap text-center ">

              <Col className={`${styles.countItem}`}>
                <div className={styles.countNumber}>{postsCount}</div>
                <div className={styles.countLabel}>publicaciones</div>
              </Col>
              <Col className={`${styles.countItem}`}>
                <div className={styles.countNumber}>{counts?.followers ?? 0}</div>
                <div className={styles.countLabel}>seguidores</div>
              </Col>
              <Col className={`${styles.countItem}`}>
                <div className={styles.countNumber}>{counts?.following ?? 0}</div>
                <div className={styles.countLabel}>siguiendo</div>
              </Col>

            </Row>
      </header>

      <div className={styles.line}>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        <div>
            {isOwn ? (
              <>
                <Button className={styles.followBtn} style={{ background: "transparent", color: "var(--bs-body-color)", border: "1px solid var(--bs-border-color)" }}>
                  Editar perfil
                </Button>
                <Button className={styles.followBtn} style={{ background: "transparent", color: "var(--bs-body-color)", border: "1px solid var(--bs-border-color)", marginLeft: 8 }}>
                  Compartir
                </Button>
              </>
            ) : (
              <div className="d-grid gap-2 mb-2">
                <Button className={styles.followBtn} onClick={() => toggleFollow(user.username)}>
                  {isFollowing ? "Dejar de seguir" : "Seguir"}
                </Button>
              </div>
            )}
        </div>
      </div>

      <section className={styles.feed} >
        {posts.length === 0 ? (
          <p className={styles.empty}>Este usuario no tiene publicaciones aún.</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              author={post.author.username}
              avatarUrl={post.author.avatarUrl}
              content={post.content}
              date={new Date(post.createdAt).toLocaleString()}
              tags={post.tags}
              comments={post.comments?.map(c => ({
                author: c.author.displayName ?? c.author.username,
                text: c.content,
                date: new Date(c.createdAt).toLocaleString()
              }))}
            />
          ))
        )}
      </section>
    </main>
  );
}

