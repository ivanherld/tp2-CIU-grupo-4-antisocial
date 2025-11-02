import { Form, Image, Row, Col, Badge } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import styles from "../styles/css/CreatePost.module.css";
import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';

interface CreatePostModalProps {
  /** URL de la API que devuelve tags (array de strings o array de objetos con 'name') */
  tagsApiUrl?: string;
}

export default function CreatePost({ tagsApiUrl = '/api/tags' }: CreatePostModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addSuggestedTag = (t: string) => {
    if (!tags.includes(t)) setTags((s) => [...s, t]);
  };

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
        //eslint-disable-next-line @typescript-eslint/no-explicit-any 
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (err) {
          // No es JSON (probablemente HTML), tratamos como "no hay tags"
          if (mounted) {
            setAvailableTags([]);
            setTagsError(null);
            console.log(err)
          }
          return;
        }
        const parsed: string[] = Array.isArray(data)
          //eslint-disable-next-line @typescript-eslint/no-explicit-any 
          ? data.map((it: any) => (typeof it === 'string' ? it : it.name ?? String(it))).filter(Boolean)
          : [];
        if (mounted) setAvailableTags(parsed);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any 
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

  return (
    <div className={styles.crearPostContainer}>
      <div className={styles.postContenido}>
        <div className={styles.userImage}>
          <p>U</p>
        </div>
        <div className={styles.nuevoPostForm}>
          <div className={styles.descripcion}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="search" placeholder="En que estas pensando ?" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
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

            {/* Sugerencias de tags desde la API */}
            <div className="mt-3">
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
        </div>
      </div>
    </div>
  )
}
