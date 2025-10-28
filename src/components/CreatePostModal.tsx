import { useState, type ChangeEvent, type KeyboardEvent, type FormEvent } from "react";
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

interface PostData {
  description: string;
  tags: string[];
  image?: string | null;
}

export default function CreatePostModal(){
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData: PostData = { description, tags, image };
    console.log("Nuevo post:", postData);
    alert("Post creado (ver consola)");
    handleClose();
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
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escribí algo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            <div className="d-flex justify-content-end">
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


