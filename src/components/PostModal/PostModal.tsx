import { useState } from "react"
import Comment, {type CommentProps } from "../Comment"
import { Button, Modal } from "react-bootstrap"
import CommentForm from "../CommentForm/CommentForm"
import styles from "./PostModal.module.css"
import Tags from "../Tags/Tags"
import { useAuth } from "../../context/AuthProvider"
import Images from "../Images/Images"

export interface PostProps {
    id: number | string,
    author: string,
    avatarUrl?: string,
    content: string,
    date?: string,
    tags?: {id: string, nombre: string}[]
    comments?: CommentProps[],
    imagenes?: {url: string}[];
    // follow control props (parent-driven)
    isFollowing?: boolean
    isProcessing?: boolean
    onFollow?: (e?: React.MouseEvent) => void
}

export default function PostModal({id, author, avatarUrl, content, date, tags = [], comments = [], imagenes = [], isFollowing = false, isProcessing = false, onFollow}: PostProps) {
    const [show, setShow] = useState(false)
    const [postComments, setPostComments] = useState<CommentProps[]>(comments)

    const {usuario} = useAuth();
    const esPropio = usuario?.username === author

    // follow click delegated to parent via onFollow
    const handleFollow = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onFollow) onFollow()
    }


    const handleAddComment = (_postId: string, text: string) => {
        //fetch para guardar el comentario
        const newComment: CommentProps = {
            author: usuario?.username || "Anónimo",
            text,
            date: new Date().toISOString() //o el createdAt supongo
        }
        setPostComments((prev) => [...prev, newComment])
    }

  return (
    <>
        <Button variant="outline-secondary" onClick={() => setShow(true)} size="sm">
            + Ver más
        </Button>
        
        <Modal show={show} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton className="bg-light">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <img
                        src={avatarUrl || "/antisocialpng.png"}
                        alt={`${author} avatar`}
                        className="rounded-circle me-2"
                        style={{ width: "auto", height: 48 }}
                    />
                </div>
                <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-2">
                        <Modal.Title className={styles.autor}>{author}</Modal.Title>
                        {!esPropio && (
                            <Button variant={isFollowing ? "outline-secondary" : "light"} size="sm" onClick={handleFollow} disabled={!!isProcessing}>
                                {isProcessing ? "Procesando..." : (isFollowing ? "Siguiendo" : "Seguir")}
                            </Button>
                        )}
                    </div>

                    {date && <small className="text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</small>}
                </div>
            </div>

            
            </Modal.Header>
            <Modal.Body className="bg-light">
                <div style={{paddingBottom: "5px", borderBottom: "1px solid #cbd5e1", marginBottom: "10px"}}>
                    <p className={styles.contenidoPost}>{content}</p>
                    <Images imagenes={imagenes}/>
                    <Tags tags={tags}/>
                </div>

                {postComments.length === 0 ? (
                    <p className="text-muted text-center mb-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>No hay comentarios</p>
                ) : (
                    postComments.map((c, i) => (
                        <Comment key={i} {...c} />
                    ))
                )}

                <div className={styles.line}/>
                <CommentForm postId={id.toString()} onAddComment={handleAddComment}/>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}
