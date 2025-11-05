import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./CommentForm.module.css"


export default function CommentForm({
  postId,
  onAddComment,
}: {
  postId: string;
  onAddComment: (postId: string, content: string) => Promise<void> | void;
}) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    (async () => {
      setSending(true);
      try {
        await Promise.resolve(onAddComment(postId, trimmed));
        setValue("");
      } catch (err) {
        console.warn('Error en onAddComment', err);
      } finally {
        setSending(false);
      }
    })();
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