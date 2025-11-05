import { type CommentProps } from './Comment';
import Card from 'react-bootstrap/Card';
import PostModal from './PostModal/PostModal';
import Tags from './Tags/Tags';

export interface PostComment extends CommentProps {}


export interface PostProps {
  id: number | string;
  author: string;
  avatarUrl?: string;
  date?: string; // display string
  content: string;
  tags?: {id: string; name: string}[];
  comments?: PostComment[];
  // follow props
  isFollowing?: boolean;
  isProcessing?: boolean;
  onFollow?: () => void;
}

export default function Post({
  id,
  author,
  avatarUrl = '/assets/antisocialpng.png',
  date,
  content,
  tags = [],
  comments = [],
  isFollowing = false,
  isProcessing = false,
  onFollow,
}: PostProps) {
  // props-driven follow handlers (parent decides how to perform follow/unfollow)
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFollow) onFollow();
  };

  return (
    <div className="card card-testimonial bg-light ">
      <div className="card-body d-flex flex-row align-items-center pb-3">
        <img src={avatarUrl} className="img-avatar rounded-circle" alt={`${author} avatar`} style={{ width: 48, height: 48 }} />
        <div className="d-flex flex-column ms-3 me-auto">
          <span className="person small ml-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}><strong>{author}</strong></span>
          {date && <span className="person-role small text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</span>}
        </div>

        {/* Botón Seguir controlado por props; el padre maneja la acción */}
        <div style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}> 
          <button 
            className={`btn btn-sm ${isFollowing ? `btn-outline-secondary`: `btn-light`}`}
            onClick={handleFollow}
            disabled={!!isProcessing}
          >
            {isProcessing ? "Procesando..." : (isFollowing ? "Siguiendo" : "Seguir")}
          </button>
        </div>
      </div>

      <div className="card-body pt-0">
        <p className="card-text" style={{fontFamily:"Open Sans, Arial, Helvetica, sans-serif"}}>{content}</p>
        <Tags tags={tags}/>

        <PostModal id={id} author={author} content={content} comments={comments} date={date} tags={tags}/>
      </div>

      <div className="card-footer p-0">
        <Card className="border-0">
            <Card.Header className="bg-transparent p-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", display: 'flex', justifyContent: 'flex-end'}}>
              <span style={{color:"#3b82f6", fontWeight:"500"}}>Comentarios ({comments.length})</span>
            </Card.Header>
        </Card>
      </div>
    </div>
  );
}
