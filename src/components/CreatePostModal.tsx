import { useContext, useState, type ChangeEvent, type KeyboardEvent, type FormEvent } from "react";
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

  return (
    <>
      {/* Botón que abre el modal */}
      <Container className="d-flex justify-content-center my-3">
      <Button variant="primary" onClick={handleShow}>
        + Crear Post
      </Button>
      </Container>
      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Descripción */}
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label><strong>{usuario?.username ?? "Usuario Anónimo"}</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="¿Qué hay de nuevo?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* Imagen URL (opcional) - backend espera URLs por ahora */}
            <Form.Group className="mb-3" controlId="formImageUrl">
              <Form.Label>URL de la imagen (opcional)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
              />
            </Form.Group>

            {/* Imagen */}
            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <div className="mt-3 text-center">
                  <Image src={image} thumbnail style={{ maxHeight: "200px" }} />
                </div>
              )}
            </Form.Group>

            {/* Tags */}
            <Form.Group className="mb-3" controlId="formTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribí un tag y presioná Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
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
            </Form.Group>

            {/* Botones */}
            <div className="d-flex justify-content-end" style={{minWidth: 320}}>
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


