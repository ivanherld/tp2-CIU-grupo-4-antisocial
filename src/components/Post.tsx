import { type CommentProps } from './Comment';
import Card from 'react-bootstrap/Card';
import PostModal from './PostModal/PostModal';
import Tags from './Tags/Tags';
import { useAuth } from '../context/AuthProvider';
import Images from './Images/Images';

export interface PostComment extends CommentProps {}


export interface PostProps {
  id: number | string;
  author: string;
  avatarUrl?: string;
  date?: string; // display string
  content: string;
  tags?: {id: string; nombre: string}[];
  comments?: PostComment[];
  imagenes?: {url: string}[];
  // follow props
  isFollowing?: boolean;
  isProcessing?: boolean;
  onFollow?: () => void;
}

export default function Post({
  id,
  author,
  avatarUrl,
  date,
  content,
  tags = [],
  comments = [],
  imagenes = [],
  isFollowing = false,
  isProcessing = false,
  onFollow,
}: PostProps) {
  // props-driven follow handlers (parent decides how to perform follow/unfollow)
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFollow) onFollow();
  };

  const {usuario} = useAuth();
  const esPropio = usuario?.username === author

  return (
    <div className="card card-testimonial bg-light ">
      <div className="card-body d-flex flex-row align-items-center pb-3">
        <img src={avatarUrl} className="img-avatar rounded-circle" alt={`${author} avatar`} style={{ width: 48, height: 48 }} />
        <div className="d-flex flex-column ms-3 me-auto">
          <span className="person small ml-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}><strong>{author}</strong></span>
          {date && <span className="person-role small text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</span>}
        </div>

        {/* Botón Seguir controlado por props; el padre maneja la acción */}
        {!esPropio && onFollow && (
          <div style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}> 
            <button 
              className={`btn btn-sm ${isFollowing ? `btn-outline-secondary`: `btn-light`}`}
              onClick={handleFollow}
              disabled={!!isProcessing}
            >
              {isProcessing ? "Procesando..." : (isFollowing ? "Siguiendo" : "Seguir")}
            </button>
          </div>
        )}

      </div>

      <div className="card-body pt-0">
        <p className="card-text" style={{fontFamily:"Open Sans, Arial, Helvetica, sans-serif"}}>{content}</p>
        <Images imagenes={imagenes} clickable/>
        <Tags tags={tags}/>

        <PostModal 
          id={id} 
          author={author} 
          avatarUrl={avatarUrl} 
          content={content} 
          comments={comments}
          imagenes={imagenes} 
          date={date} 
          tags={tags}
          isFollowing={isFollowing}
          isProcessing={isProcessing}
          onFollow={onFollow}
          />
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
