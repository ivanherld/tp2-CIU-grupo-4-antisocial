import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./CommentForm.module.css"


export default function CommentForm({
  postId,
  onAddComment,
}: {
  postId: string;
  onAddComment: (postId: string, content: string) => void;
}) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

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