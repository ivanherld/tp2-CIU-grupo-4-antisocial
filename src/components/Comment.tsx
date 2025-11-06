import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { tiempoRelativo } from '../utils/timeUtils';


export interface CommentProps {
    author: string;
    date?: string; 
    text: string;
    avatarUrl?: string;
}

export default function Comment({ author, date, text, avatarUrl }: CommentProps) {
    const { usuario } = useAuth();
    const profileLink = usuario?.username?.toLowerCase() === author.toLowerCase()
        ? '/profile/me'
        : `/users/${encodeURIComponent(author)}`;
    
    return (
        <div className="comment mb-3 p-2 rounded shadow-sm">
            <div className="d-flex align-items-center mb-2">
                <img src={avatarUrl || "/antisocialpng.png"} className="img-avatar me-2 rounded-circle" alt={`${author} avatar`} style={{ width: "auto", height: 40 }}/>
                <div className="d-flex flex-column">
                    <Link to={profileLink} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h6 className="comment-author mb-0" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>{author}</h6>
                    </Link>
                    {date && <small className="comment-date text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{tiempoRelativo(date)}</small>}
                </div>
            </div>
            <div className="mt-2" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{text}</div>
        </div>
    );
}
