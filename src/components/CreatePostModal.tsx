import { useContext, useState, type KeyboardEvent, type FormEvent, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Badge,
  Row,
  Col,
  Container,
  Toast,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

interface CreatePostModalProps {
  onClose?: () => void; // prop opcional para cerrar Offcanvas
}

export default function CreatePostModal({onClose}: CreatePostModalProps){
  const { usuario } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState<string>("");

  const [tags, setTags] = useState<{ nombre: string }[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);

  // For now backend expects image URLs; allow user to optionally provide an image URL.
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  // Toast state for nicer, non-blocking UI messages
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

  const handleClose = () => {setShow(false); if(onClose) onClose()};
  const handleShow = () => setShow(true);

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true

    const fetchTags = async() => {
      setTagsLoading(true)
      setTagsError(null)
      try {
        const res = await api.get("/tag", {signal: ac.signal})
        const data = res.data;
        const parsed: string[] = Array.isArray(data)
          ? data
              .map((it: any) => {
                if (typeof it === "string") return it;
                // accept different shapes: { nombre }, { name }
                return it.nombre ?? it.name ?? String(it);
              })
              .filter(Boolean)
          : []
        if(mounted) setAvailableTags(parsed)
      } catch (err: any) {
        if(err.name === "CanceledError" || err.name === "AbortError") return;
        if(mounted) setTagsError(err.message || "Error cargando tags")
      } finally {
        if(mounted) setTagsLoading(false)
      }
    }

    fetchTags()
    return () => {
      mounted = false
      ac.abort()
    }
  }, [])

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTagName = tagInput.trim();
      // avoid duplicates by nombre
      if (!tags.some((t) => t.nombre === newTagName)) {
        setTags([...tags, { nombre: newTagName }]);
      }
      setTagInput("");
    }
  };

  const handleImageUrlKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && imageUrlInput.trim() !== "") {
      e.preventDefault()
      const newUrl = imageUrlInput.trim()
      if(!imageUrls.includes(newUrl)) {
        setImageUrls([...imageUrls, newUrl])
      }
      setImageUrlInput("")
    }
  }

  const removeImageUrl = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter((u) => u !== urlToRemove))
  }

  const addSuggestedTag = (t: string) => {
    if (!tags.some((tag) => tag.nombre === t)) {
      setTags((s) => [...s, { nombre: t }]);
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag.nombre !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostError(null);
    setPosting(true);
    try {
      // Decide route based on presence of imageUrlInput and tags
      const hasImageUrl = imageUrls.length > 0;
      const hasTags = tags.length > 0;

      if (hasImageUrl && hasTags) {
        // create-completo expects imagenes array and tags; backend expects 'texto' instead of 'description'
        const payload = { texto: description, tags: tags, imagenes: imageUrls.map((url) => ({url})) };
        console.log('POST /post/create-completo payload:', payload);
        const res = await api.post('/post/create-completo', payload);
        console.log('create-completo response', res.data);
      } else if (hasImageUrl) {
        const payload = { texto: description, imagenes: imageUrls.map((url) => ({url})) };
        console.log('POST /post/create-imagenes payload:', payload);
        const res = await api.post('/post/create-imagenes', payload);
        console.log('create-imagenes response', res.data);
      } else if (hasTags) {
        const payload = { texto: description, tags: tags };
        console.log('POST /post/create-tags payload:', payload);
        const res = await api.post('/post/create-tags', payload);
        console.log('create-tags response', res.data);
      } else {
        const payload = { texto: description };
        console.log('POST /post payload:', payload);
        const res = await api.post('/post', payload);
        console.log('create post response', res.data);
      }

  // Success: reset form, show toast and close
  setDescription("");
  setTags([]);
  setTagInput("");
  setImageUrlInput("");
  setImageUrls([]);
  setPostError(null);
  setToastVariant("success");
  setToastMessage("Post creado correctamente");
  setToastShow(true);
  handleClose();
    } catch (err: any) {
      console.error('Create post error', err);
      const extractErrorMessage = (e: any) => {
        // axios error with response
        if (e?.response) {
          const data = e.response.data;
          // common shapes: string, { message }, { error }, { errors: [...] }
          if (!data) return `Error ${e.response.status}: ${e.response.statusText || 'server error'}`;
          if (typeof data === 'string') return data;
          if (typeof data === 'object') {
            if (data.message) return data.message;
            if (data.error) return data.error;
            if (Array.isArray(data.errors)) return data.errors.map((it: any) => (it.msg || it.message || String(it))).join('; ');
            // sometimes the backend returns validation object { field: ['msg'] }
            if (Object.keys(data).length > 0) return JSON.stringify(data);
          }
          return String(data);
        }
        // no response received
        if (e?.request) return 'No response from server';
        // fallback to error message
        return e?.message ?? String(e);
      };

  const message = extractErrorMessage(err);
  setPostError(message);
  setToastVariant("danger");
  setToastMessage(message);
  setToastShow(true);
    } finally {
      setPosting(false);
    }
  };

  const estiloBoton = {
    fontFamily:"Montserrat, Arial, Helvetica, sans-serif",
    whiteSpace: "nowrap",
    fontSize: "0.9rem",
  }

  return (
    <>
      {/* Botón que abre el modal */}
      <Container className="d-flex justify-content-center my-3">
      <Button variant="outline-success" onClick={handleShow} style={estiloBoton}>
        + Crear Post
      </Button>
      </Container>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight:"600", color:"#5fa92c"}}>Nuevo Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Descripción */}
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}><strong>{usuario?.username ?? "Usuario Anónimo"}</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="¿Qué hay de nuevo?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
              />
            </Form.Group>

            {/* Imagen URL (opcional) - backend espera URLs por ahora */}
            <Form.Group className="mb-3" controlId="formImageUrl">
              <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>URL de imágenes (opcional)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={handleImageUrlKeyDown}
                style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
              />
              <Row className="mt-2">
                <Col>
                  {imageUrls.map((url) => (
                    <Badge
                      key={url}
                      bg="info"
                      pill
                      className="me-2 mb-2"
                      style={{cursor: "pointer"}}
                      onClick={() => removeImageUrl(url)}
                    >
                      {url.length > 25 ? url.slice(0, 25) + "..." : url} ✕
                    </Badge>
                  ))}
                </Col>
              </Row>
            </Form.Group>

            {/* Tags */}
            <Form.Group className="mb-3" controlId="formTags">
              <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribí un tag y presioná Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
              />
              <Row className="mt-2">
                <Col>
                  {tags.map((tag) => (
                    <Badge
                      key={tag.nombre}
                      bg="secondary"
                      pill
                      className="me-2"
                      style={{ cursor: "pointer", fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}
                      onClick={() => removeTag(tag.nombre)}
                    >
                      {tag.nombre} ✕
                    </Badge>
                  ))}
                </Col>
              </Row>
            
              {/* Sugerencias de tags desde la API */}
                <div className="mt-3" style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}>
                  <div className="mt-2">
                    {tagsLoading && <span className="text-muted"> Cargando tags...</span>}
                    {tagsError && <span className="text-danger"> {tagsError}</span>}
                    {!tagsLoading && !tagsError && availableTags.length === 0 && (
                      <span className="text-muted">No hay tags sugeridos</span>
                    )}
                    {!tagsLoading && !tagsError && availableTags.length > 0 && availableTags.slice(0, 12).map((t) => (
                      <Badge
                        key={t}
                        bg={tags.some(tag => tag.nombre === t) ? 'success' : 'light'}
                        text={tags.some(tag => tag.nombre === t) ? undefined : 'dark'}
                        pill
                        className="me-2 mb-2"
                        style={{ cursor: 'pointer', border: '1px solid rgba(0,0,0,0.08)', fontFamily:"Montserrat, Arial, Helvetica, sans-serif" }}
                        onClick={() => addSuggestedTag(t)}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
            </Form.Group>


            {/* Botones */}
            <div className="d-flex justify-content-end" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif", minWidth: 320}}>
              <div className="me-2" style={{minWidth: 220}}>
                {postError && <div className="text-danger mb-2">{postError}</div>}
              </div>
              <Button variant="secondary" onClick={handleClose} className="me-2" disabled={posting}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={posting}>
                {posting ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
        {/* Toast container (esquina superior derecha) */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ position: "fixed", top: 12, right: 12, zIndex: 1600 }}
        >
          <Toast
            onClose={() => setToastShow(false)}
            show={toastShow}
            autohide
            delay={3000}
            bg={toastVariant}
          >
            <Toast.Header>
              <strong className="me-auto">
                {toastVariant === "success" ? "Éxito" : "Error"}
              </strong>
            </Toast.Header>
            <Toast.Body className={toastVariant === "danger" ? "text-white" : undefined}>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </div>
    </>
  );
};


