import { useState, useEffect } from "react"
import api from "../../api"
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
    const [loadingComments, setLoadingComments] = useState<boolean>(false)
    const [commentsError, setCommentsError] = useState<string | null>(null)

    const {usuario} = useAuth();
    const esPropio = usuario?.username === author

    // follow click delegated to parent via onFollow
    const handleFollow = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onFollow) onFollow(e)
    }


    // Return a Promise so callers (CommentForm) can await and disable UI while posting
    const handleAddComment = async (_postId: string, text: string): Promise<void> => {
        try {
            const payload = { postId: _postId, texto: text };
            const res = await api.post('/comment', payload);
            const created = res.data;
            // normalizar respuesta a CommentProps
            const appended: CommentProps = {
                author: created?.usuario?.username ?? created?.username ?? usuario?.username ?? "Anónimo",
                text: created?.texto ?? created?.text ?? text,
                date: created?.createdAt ?? created?.updatedAt ?? new Date().toISOString(),
                avatarUrl: created?.usuario?.avatarUrl ?? undefined,
            };
            setPostComments((prev) => [...prev, appended]);
        } catch (err) {
            // si falla la petición, añadir el comentario localmente para no bloquear UX
            const newComment: CommentProps = {
                author: usuario?.username || "Anónimo",
                text,
                date: new Date().toISOString(),
            };
            setPostComments((prev) => [...prev, newComment]);
            console.warn('Error creando comentario', err);
            // rethrow so caller can be aware if needed
            // (but keep UX fallback already applied)
        }
    }

    // fetch existing comments when modal opens
    useEffect(() => {
        if (!show) return;
        let canceled = false;
        const controller = new AbortController();
        (async () => {
            setLoadingComments(true);
            setCommentsError(null);
            try {
                const res = await api.get<any[]>(`/post/${encodeURIComponent(id.toString())}/comments`, { signal: controller.signal });
                if (canceled) return;
                const apiComments = Array.isArray(res.data) ? res.data : [];
                const normalized: CommentProps[] = apiComments.map((c: any) => ({
                    author: c.usuario?.username ?? c.username ?? c.author ?? 'Anonimo',
                    text: c.texto ?? c.text ?? c.descripcion ?? '',
                    date: c.createdAt ?? c.updatedAt ?? undefined,
                    avatarUrl: c.usuario?.avatarUrl ?? undefined,
                }));
                setPostComments(normalized);
            } catch (err: any) {
                if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
                console.warn('Error fetching comments', err);
                setCommentsError(err?.message ?? 'Error cargando comentarios');
            } finally {
                if (!canceled) setLoadingComments(false);
            }
        })();
        return () => {
            canceled = true;
            controller.abort();
        };
    }, [show, id]);

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
                        style={{ width: 48, height: 48 }}
                    />
                </div>
                <div className="d-flex flex-column">
                    <Modal.Title className={styles.autor}>{author}</Modal.Title>
                    {date && <small className="text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</small>}
                </div>
            </div>

            {!esPropio && onFollow && (
                <div className="ms-3">
                    <Button variant={isFollowing ? "outline-secondary" : "light"} size="sm" onClick={handleFollow} disabled={!!isProcessing}>
                        {isProcessing ? "Procesando..." : (isFollowing ? "Siguiendo" : "Seguir")}
                    </Button>
                </div>
            )}


            </Modal.Header>
            <Modal.Body className="bg-light">
                <div style={{paddingBottom: "5px", borderBottom: "1px solid #cbd5e1", marginBottom: "10px"}}>
                    <p className={styles.contenidoPost}>{content}</p>
                    <Images imagenes={imagenes}/>
                    <Tags tags={tags}/>
                </div>
                {loadingComments ? (
                    <div className="text-muted">Cargando comentarios...</div>
                ) : commentsError ? (
                    <div className="text-danger">{commentsError}</div>
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
