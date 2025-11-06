import { type CommentProps } from './Comment';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { useEffect, useState } from 'react';
import api from '../api';
import axios from 'axios';
import PostModal from './PostModal/PostModal';
import Tags from './Tags/Tags';
import Images from './Images/Images';

export interface PostComment extends CommentProps {}


export interface PostProps {
  id: number | string;
  author: string;
  authorId?: string;
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
  authorId,
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
  const { usuario } = useAuth();
  const currentUsername = usuario?.username;
  const profileLink = currentUsername && currentUsername.toLowerCase() === author.toLowerCase()
    ? '/profile/me'
    : `/users/${encodeURIComponent(author)}`;
  

  const [commentCount, setCommentCount] = useState<number>(comments?.length ?? 0);

  useEffect(() => {
    let canceled = false;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await api.get<any[]>(`/post/${encodeURIComponent(String(id))}/comments`, { signal: controller.signal });
        if (canceled) return;
        const arr = Array.isArray(res.data) ? res.data : [];
        setCommentCount(arr.length);
      } catch (e) {
        if (axios.isAxiosError(e) && e.code === 'ERR_CANCELED') return;
        console.warn('Error fetching comments for post', e);
      }
    })();
    return () => {
      canceled = true;
      controller.abort();
    };
  }, [id]);

  return (
    <div className="card card-testimonial"> 
      <div className="card-body d-flex flex-row align-items-center pb-3">
        <img src={avatarUrl || "/antisocialpng.png"} className="img-avatar rounded-circle" alt={`${author} avatar`} style={{ width: "auto", height: 48 }} />
        <div className="d-flex flex-column ms-3 me-auto">
          <span className="person small ml-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>
            <Link to={profileLink} style={{ textDecoration: 'none', color: 'inherit' }}>
              <strong>{author}</strong>
            </Link>
          </span>
          {date && 
            <span 
            className="person-role small text-muted" 
            style={{
              fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
              wordBreak:"break-word",
              whiteSpace:"normal",
              overflowWrap:"anywhere"}}>{date}</span>}
        </div>

      </div>

      <div className="card-body pt-0">
        <p className="card-text" style={{fontFamily:"Open Sans, Arial, Helvetica, sans-serif"}}>{content}</p>
        <Images imagenes={imagenes}/>
        <Tags tags={tags}/>

        <PostModal 
          id={id} 
          author={author} 
          authorId={authorId}
          avatarUrl={avatarUrl} 
          content={content} 
          comments={comments}
          imagenes={imagenes} 
          date={date} 
          tags={tags}
          isFollowing={isFollowing}
          isProcessing={isProcessing}
          onFollow={onFollow}
          onCommentsCountUpdate={(_, count) => setCommentCount(count)}
          />
      </div>

      <div className="card-footer p-0">
        <Card className="border-0">
            <Card.Header className="bg-transparent p-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", display: 'flex', justifyContent: 'flex-end'}}>
              <span style={{color:"#3b82f6", fontWeight:"500"}}>Comentarios ({commentCount})</span>
            </Card.Header>
        </Card>
      </div>
    </div>
  );
}

