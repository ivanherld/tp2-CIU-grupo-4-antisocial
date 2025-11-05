import { useContext, useState, type ChangeEvent, type KeyboardEvent, type FormEvent, useEffect } from "react";
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
import api from "../api";


export default function CreatePostModal(){
  const { usuario } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState<string>("");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);

  const [image, setImage] = useState<string | null>(null);
  // For now backend expects image URLs; allow user to optionally provide an image URL.
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

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
          ? data.map((it: any) => (typeof it === "string" ? it: it.name ?? String(it))).filter(Boolean)
          : []
        if(mounted) setAvailableTags(parsed)
      } catch (err: any) {
        if(err.name == "CanceledError" || err.name === "AbortError") return;
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
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const addSuggestedTag = (t: string) => {
    if(!tags.includes(t)) setTags((s) => [...s, t])
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostError(null);
    setPosting(true);
    try {
      // Decide route based on presence of imageUrlInput and tags
      const hasImageUrl = imageUrlInput.trim() !== '';
      const hasTags = tags.length > 0;

      if (hasImageUrl && hasTags) {
        // create-completo expects imagenes array and tags; backend expects 'texto' instead of 'description'
        const payload = { texto: description, tags, imagenes: [imageUrlInput.trim()] };
        console.log('POST /post/create-completo payload:', payload);
        const res = await api.post('/post/create-completo', payload);
        console.log('create-completo response', res.data);
      } else if (hasImageUrl) {
        const payload = { texto: description, imagenes: [imageUrlInput.trim()] };
        console.log('POST /post/create-imagenes payload:', payload);
        const res = await api.post('/post/create-imagenes', payload);
        console.log('create-imagenes response', res.data);
      } else if (hasTags) {
        const payload = { texto: description, tags };
        console.log('POST /post/create-tags payload:', payload);
        const res = await api.post('/post/create-tags', payload);
        console.log('create-tags response', res.data);
      } else {
        const payload = { texto: description };
        console.log('POST /post payload:', payload);
        const res = await api.post('/post', payload);
        console.log('create post response', res.data);
      }

      // Success: reset form and close
      setDescription('');
      setTags([]);
      setTagInput('');
      setImage(null);
      setImageUrlInput('');
      alert('Post creado correctamente');
      handleClose();
    } catch (err: any) {
      console.error(err);
    console.error('Create post error', err);
    const respData = err?.response?.data;
    const message = respData?.message || respData || err?.message || 'Error creando el post';
    // if it's an object, stringify to show details
    setPostError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setPosting(false);
    }
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

            {/* Imagen URL (opcional) - backend espera URLs por ahora */}
            <Form.Group className="mb-3" controlId="formImageUrl">
              <Form.Label style={{fontFamily:"Montserrat, Arial, Helvetica, sans-serif"}}>URL de la imagen (opcional)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
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
    </>
  );
};


