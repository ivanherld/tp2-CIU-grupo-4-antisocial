
import Comment, { type CommentProps } from './Comment';

export interface PostComment extends CommentProps {}

export interface PostProps {
  id?: number | string;
  author: string;
  avatarUrl?: string;
  isFollowing?: boolean;
  onFollow?: (author: string) => void;
  date?: string; // display string
  content: string;
  comments?: PostComment[];
}

export default function Post({
  author,
  avatarUrl = '/assets/antisocialpng.png',
  isFollowing = false,
  onFollow,
  date,
  content,
  comments = [],
}: PostProps) {
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFollowing && onFollow) onFollow(author);
  };

  return (
    <div className="card card-testimonial bg-light ">
      <div className="card-body d-flex flex-row align-items-center pb-3">
        <img src={avatarUrl} className="img-avatar rounded-circle" alt={`${author} avatar`} style={{ width: 48, height: 48 }} />
        <div className="d-flex flex-column ms-3 me-auto">
          <span className="person small ml-2"><strong>{author}</strong></span>
          {date && <span className="person-role small text-muted">{date}</span>}
        </div>

        {/* Botón Seguir solo habilitado si no sigo al autor */}
        <div>
          {!isFollowing ? (
            <button className="btn btn-light btn-sm" onClick={handleFollow}>Seguir</button>
          ) : (
            <button className="btn btn-outline-secondary btn-sm" disabled>Siguiendo</button>
          )}
        </div>
      </div>

      <div className="card-body pt-0">
        <p className="card-text">{content}</p>
      </div>

      {/* Comentarios */}
      {comments.length > 0 && (
        <div className="card-footer">
          {comments.map((c, idx) => (
            <Comment key={idx} author={c.author} date={c.date} text={c.text} />
          ))}
        </div>
      )}
    </div>
  );
}
