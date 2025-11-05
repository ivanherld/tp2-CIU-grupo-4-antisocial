

export interface CommentProps {
    author: string;
    date?: string; // ISO or human string
    text: string;
    avatarUrl?: string;
}

export default function Comment({ author, date, text, avatarUrl }: CommentProps) {
    return (
        <div className="comment mb-3 p-2 bg-white rounded shadow-sm">
            <div className="d-flex align-items-center mb-2">
                <img src={avatarUrl || "/antisocialpng.png"} className="img-avatar me-2 rounded-circle" alt={`${author} avatar`} style={{ width: "auto", height: 40 }}/>
                <div className="d-flex flex-column">
                    <h6 className="comment-author mb-0" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>{author}</h6>
                    {date && <small className="comment-date text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</small>}
                </div>
            </div>
            <div className="mt-2" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{text}</div>
        </div>
    );
}
