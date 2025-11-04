import React from "react";
import styles from "../pages/UserProfile.module.css";
import { Button } from "react-bootstrap";

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
  isFollowing?: boolean;
  isOwn?: boolean;
  onFollowToggle?: () => void;
  onAddComment?: (postId: string, content: string) => void;
};

export default function Perfil({
  user,
  counts,
  posts,
  isFollowing,
  isOwn,
  onFollowToggle,
  onAddComment,
}: PerfilProps) {
  const postsCount = posts?.length ?? 0;
  return (
    <main className={`px-4 px-md-5 ${styles.profile}`}>
      <header className={styles.header}>
        <div className={styles.avatarCol}>
          <img
            className={styles.avatar}
            src={user.avatarUrl ?? "/default-avatar.png"}
            alt={`${user.username} avatar`}
          />
          <div className={styles.nameBlock}>
            <h1 className={styles.displayName}>
              {user.displayName ?? user.username}
            </h1>
            <p className={styles.username}>@{user.username}</p>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.counts}>
            <div className={styles.countItem}>
              <div className={styles.countNumber}>{postsCount}</div>
              <div className={styles.countLabel}>publicaciones</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countNumber}>{counts?.followers ?? 0}</div>
              <div className={styles.countLabel}>seguidores</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countNumber}>{counts?.following ?? 0}</div>
              <div className={styles.countLabel}>siguiendo</div>
            </div>
          </div>
        </div>

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
              onFollowToggle && (
                <div className="d-grid gap-2 mb-2">
                  <Button className={styles.followBtn} onClick={onFollowToggle}>
                    {isFollowing ? "Dejar de seguir" : "Seguir"}
                  </Button>
                </div>
              )
            )}
        </div>
      </div>

      <section className={styles.feed}>
        {posts.length === 0 ? (
          <p className={styles.empty}>Este usuario no tiene publicaciones aún.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <strong>{post.author.displayName ?? post.author.username}</strong>
                <time className={styles.time}>
                  {new Date(post.createdAt).toLocaleString()}
                </time>
              </div>

              <p className={styles.postContent}>{post.content}</p>

              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map((t) => (
                    <span key={t.id} className={styles.tag}>
                      #{t.name}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.comments}>
                {post.comments?.map((c) => (
                  <div key={c.id} className={styles.comment}>
                    <strong>@{c.author.username}</strong> {c.content}
                  </div>
                ))}
              </div>

              {onAddComment && (
                <CommentForm postId={post.id} onAddComment={onAddComment} />
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}

function CommentForm({
  postId,
  onAddComment,
}: {
  postId: string;
  onAddComment: (postId: string, content: string) => void;
}) {
  const [value, setValue] = React.useState("");
  const [sending, setSending] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      onAddComment(postId, trimmed);
      setValue("");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className={styles.commentForm}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Agregar un comentario..."
        className={styles.commentInput}
        disabled={sending}
      />
      <Button type="submit" disabled={sending || !value.trim()} variant="secondary">
        {sending ? "Enviando..." : "Comentar"}
      </Button>
    </form>
  );
}