

export interface CommentProps {
    author: string;
    date?: string; // ISO or human string
    text: string;
}

export default function Comment({ author, date, text }: CommentProps) {
    return (
        <div className="media comment mb-3">
            <img src="/assets/antisocialpng.png" className="img-avatar mr-3" alt={`${author} avatar`} />
            <div className="media-body">
                <div className="media-body-header d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="comment-author mb-0" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>{author}</h6>
                        {date && <small className="comment-date text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</small>}
                    </div>
                </div>
                <div className="mt-2" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{text}</div>
            </div>
        </div>
    );
}
