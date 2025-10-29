import React from "react";
import styles from "../pages/UserProfile.module.css";

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
  onFollowToggle?: () => void;
  onAddComment?: (postId: string, content: string) => void;
};

export default function Perfil({
  user,
  counts,
  posts,
  currentUser,
  onFollowToggle,
  onAddComment,
}: PerfilProps) {
  return (
    <main className={styles.profile}>
      <header className={styles.header}>
        <img
          className={styles.avatar}
          src={user.avatarUrl ?? "/default-avatar.png"}
          alt={`${user.username} avatar`}
        />
        <div className={styles.meta}>
          <h1 className={styles.displayName}>
            {user.displayName ?? user.username}
          </h1>
          <p className={styles.username}>@{user.username}</p>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
          <div className={styles.counts}>
            <span>{counts?.followers ?? 0} seguidores</span>
            <span>{counts?.following ?? 0} siguiendo</span>
          </div>
        </div>

        {currentUser?.username !== user.username && onFollowToggle && (
          <div className={styles.actions}>
            <button className={styles.followBtn} onClick={onFollowToggle}>
              Seguir / Dejar de seguir
            </button>
          </div>
        )}
      </header>

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
      <button type="submit" disabled={sending || !value.trim()}>
        {sending ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
}