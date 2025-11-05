import { useContext, useEffect, useState, type ChangeEvent, type KeyboardEvent, type FormEvent } from "react";
import {
  Modal,
  Button,
  Form,
  Badge,
  Image,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";



interface CreatePostModalProps {
  /** URL de la API que devuelve tags (array de strings o array de objetos con 'name') */
  tagsApiUrl?: string;
}

interface PostData {
  description: string;
  tags: string[];
  image?: string | null;
}

export default function CreatePostModal({ tagsApiUrl = '/api/tags' }: CreatePostModalProps){
  const { usuario } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const addSuggestedTag = (t: string) => {
    if (!tags.includes(t)) setTags((s) => [...s, t]);
  };

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    const fetchTags = async () => {
      setTagsLoading(true);
      setTagsError(null);
      try {
        const res = await fetch(tagsApiUrl, { signal: ac.signal });
        if (!res.ok) {
          // Si la ruta no existe o responde 404/500, no mostramos error técnico crudo,
          // simplemente no hay sugerencias disponibles.
          if (mounted) setAvailableTags([]);
          return;
        }

        // Leemos como texto primero porque algunas rutas devuelven HTML (página 404)
        const text = await res.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          // No es JSON (probablemente HTML), tratamos como "no hay tags"
          if (mounted) {
            setAvailableTags([]);
            setTagsError(null);
          }
          return;
        }

        const parsed: string[] = Array.isArray(data)
          ? data.map((it: any) => (typeof it === 'string' ? it : it.name ?? String(it))).filter(Boolean)
          : [];
        if (mounted) setAvailableTags(parsed);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (mounted) setTagsError(err.message || 'Error cargando tags');
      } finally {
        if (mounted) setTagsLoading(false);
      }
    };
    fetchTags();
    return () => { mounted = false; ac.abort(); };
  }, [tagsApiUrl]);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData: PostData = { description, tags, image };
    console.log("Nuevo post:", postData);
    alert("Post creado (ver consola)");
    handleClose();
  };

  const estiloBoton = {
    fontFamily:"Montserrat, Arial, Helvetica, sans-serif",
    whiteSpace: "nowrap",
    fontSize: "0.9rem",
    padding: "0.4rem 0.8rem"
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

            {/* Imagen */}
            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{fontFamily: "Open Sans, Arial, Helvetica, sans-serif"}}
              />
              {image && (
                <div className="mt-3 text-center">
                  <Image src={image} thumbnail style={{ maxHeight: "200px" }} />
                </div>
              )}
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
                      key={tag}
                      bg="secondary"
                      pill
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ✕
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
                      bg={tags.includes(t) ? 'success' : 'light'}
                      text={tags.includes(t) ? undefined : 'dark'}
                      pill
                      className="me-2 mb-2"
                      style={{ cursor: 'pointer', border: '1px solid rgba(0,0,0,0.08)' }}
                      onClick={() => addSuggestedTag(t)}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </Form.Group>

            {/* Botones */}
            <div className="d-flex justify-content-end" style={{fontFamily: "Montserrat, Arial, Helvetica, sans-serif"}}>
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Publicar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};


