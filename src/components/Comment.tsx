

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
                        <h6 className="comment-author mb-0">{author}</h6>
                        {date && <small className="comment-date text-muted">{date}</small>}
                    </div>
                    <div>
                        <a className="comment-reply me-2" href="#">Reply</a>
                        <a className="comment-share" href="#">Share</a>
                    </div>
                </div>
                <div className="mt-2">{text}</div>
            </div>
        </div>
    );
}
