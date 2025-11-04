import { useState } from "react"
import Comment, {type CommentProps } from "../Comment"
import { Button, Modal } from "react-bootstrap"
import CommentForm from "../CommentForm/CommentForm"
import styles from "./PostModal.module.css"
import Tags from "../Tags/Tags"
import { useAuth } from "../../context/AuthProvider"

export interface PostProps {
    id: number | string,
    author: string,
    content: string,
    date?: string,
    tags?: {id: string, name: string}[]
    comments?: CommentProps[]
}

export default function PostModal({id, author, content, date, tags = [], comments = []}: PostProps) {
    const [show, setShow] = useState(false)
    const [postComments, setPostComments] = useState<CommentProps[]>(comments)

    const {following, toggleFollow} = useAuth()
    const isFollowing = !!following[author]


    const handleAddComment = (postId: string, text: string) => {
        //fetch para guardar el comentario
        const newComment: CommentProps = {
            author:"Yo", //segun el usuario
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
                <div className="d-flex flex-column">
                    <Modal.Title className={styles.autor}>{author}</Modal.Title>
                    {date && <small className="text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</small>}
                </div>
                <div className="ms-3">
                    <Button variant={isFollowing ? "outline-secondary" : "light"} size="sm" onClick={() => toggleFollow(author)}>
                        {isFollowing? "Siguiendo" : "Seguir"}
                    </Button>
                </div>
            </Modal.Header>
            <Modal.Body className="bg-light">
                <div style={{paddingBottom: "5px", borderBottom: "1px solid #cbd5e1", marginBottom: "10px"}}>
                    <p className={styles.contenidoPost}>{content}</p>
                    <Tags tags={tags}/>
                </div>
                {postComments.map((c, i) => (
                    <Comment key={i} {...c} />
                ))}
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
