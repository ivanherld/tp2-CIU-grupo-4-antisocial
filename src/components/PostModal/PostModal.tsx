import { useState, useEffect } from "react"
import api from "../../api"
import Comment, {type CommentProps } from "../Comment"
import { Button, Modal } from "react-bootstrap"
import CommentForm from "../CommentForm/CommentForm"
import styles from "./PostModal.module.css"
import Tags from "../Tags/Tags"
import { useAuth } from "../../context/AuthProvider"
import Images from "../Images/Images"
import { Link } from "react-router-dom"

export interface PostProps {
    id: number | string,
    author: string,
    authorId?: string,
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
    onCommentsCountUpdate?: (postId: string | number, count: number) => void
}

export default function PostModal({id, author, authorId, avatarUrl, content, date, tags = [], comments = [], imagenes = [], isFollowing = false, isProcessing = false, onFollow, onCommentsCountUpdate}: PostProps) {
    const [show, setShow] = useState(false)
    const [postComments, setPostComments] = useState<CommentProps[]>(comments)
    const [loadingComments, setLoadingComments] = useState<boolean>(false)
    const [commentsError, setCommentsError] = useState<string | null>(null)

    const {usuario, follow, unfollow, isFollowing: authIsFollowing} = useAuth();
    const esPropio = usuario?.username === author
    const profileLink = usuario?.username?.toLowerCase() === author.toLowerCase()
    ? '/profile/me'
    : `/users/${encodeURIComponent(author)}`;

    const [localFollowing, setLocalFollowing] = useState<boolean>(!!isFollowing);
    const [localProcessing, setLocalProcessing] = useState<boolean>(!!isProcessing);
    const [followError, setFollowError] = useState<string | null>(null);

    // when modal opens or authorId changes, ask provider if we're following this author
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!show) return;
            if (!authorId) return; // cannot determine without id
            if (typeof authIsFollowing !== 'function') return;
            try {
                const res = await authIsFollowing(String(authorId));
                if (!cancelled) setLocalFollowing(!!res);
            } catch (e) {
                console.warn('isFollowing check failed', e);
            }
        })();
        return () => { cancelled = true; };
    }, [show, authorId, authIsFollowing]);

    // follow click handled via provider when authorId is available, otherwise delegate to parent
    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!authorId) {
            if (onFollow) onFollow();
            return;
        }
        if (!usuario) {
            // user not authenticated; delegate to parent to handle (navigation to login) or no-op
            if (onFollow) return onFollow();
            return;
        }

        // optimistic update
        const prev = localFollowing;
        setLocalFollowing(!prev);
        setLocalProcessing(true);
        setFollowError(null);
        try {
            if (!prev) {
                if (typeof follow !== 'function') throw new Error('follow helper missing');
                await follow(String(authorId));
            } else {
                if (typeof unfollow !== 'function') throw new Error('unfollow helper missing');
                await unfollow(String(authorId));
            }
        } catch (err: any) {
            console.warn('follow/unfollow failed', err);
            setLocalFollowing(prev); // revert
            setFollowError(err?.message ?? 'No se pudo completar la acción');
            setTimeout(() => setFollowError(null), 4000);
        } finally {
            setLocalProcessing(false);
        }
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
            setPostComments((prev) => {
                const next = [...prev, appended];
                if (typeof onCommentsCountUpdate === 'function') {
                    try { onCommentsCountUpdate(id, next.length); } catch (e) { console.warn('onCommentsCountUpdate handler failed', e); }
                }
                return next;
            });
        } catch (err) {
            // si falla la petición, añadir el comentario localmente para no bloquear UX
            const newComment: CommentProps = {
                author: usuario?.username || "Anónimo",
                text,
                date: new Date().toISOString(),
            };
            setPostComments((prev) => {
                const next = [...prev, newComment];
                if (typeof onCommentsCountUpdate === 'function') {
                    try { onCommentsCountUpdate(id, next.length); } catch (e) { console.warn('onCommentsCountUpdate handler failed', e); }
                }
                return next;
            });
            console.warn('Error creando comentario', err);
            // keep UX fallback applied; do not rethrow so caller treats as success
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
                if (typeof onCommentsCountUpdate === 'function') {
                    try { onCommentsCountUpdate(id, normalized.length); } catch (e) { console.warn('onCommentsCountUpdate handler failed', e); }
                }
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
        <Button variant="outline-secondary" onClick={() => setShow(true)} size="sm" style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>
            + Ver más
        </Button>
        
        <Modal show={show} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
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
                        <Link to={profileLink} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Modal.Title className={styles.autor}>{author}</Modal.Title>
                        </Link>
                        {!esPropio && (
                            <div className="d-flex flex-column" style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>
                                <Button variant={localFollowing ? "outline-secondary" : "light"} size="sm" onClick={handleFollow} disabled={!!localProcessing}>
                                    {localProcessing ? "Procesando..." : (localFollowing ? "Siguiendo" : "Seguir")}
                                </Button>
                                {followError && <small className="text-danger mt-1">{followError}</small>}
                            </div>
                        )}
                    </div>

                    {date && <small className="text-muted" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>{date}</small>}
                </div>
            </div>

            
            </Modal.Header>
            <Modal.Body>
                <div style={{paddingBottom: "5px", borderBottom: "1px solid #cbd5e1", marginBottom: "10px"}}>
                    <p className={styles.contenidoPost}>{content}</p>
                    <Images imagenes={imagenes}/>
                    <Tags tags={tags}/>
                </div>
                {loadingComments ? (
                    <div className="text-muted" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>Cargando comentarios...</div>
                ) : commentsError ? (
                    <div className="text-danger" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>{commentsError}</div>
                ) : postComments.length === 0 ? (
                    <p className="text-muted text-center mb-2" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>No hay comentarios</p>
                ) : (
                    postComments.map((c, i) => <Comment key={i} {...c} />)
                )}
                <div className={styles.line}/>
                <CommentForm postId={id.toString()} onAddComment={handleAddComment}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)} style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}
