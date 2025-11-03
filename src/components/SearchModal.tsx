import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  show: boolean;
  onHide: () => void;
}

function SearchModal({ show, onHide }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    navigate(`/feed?tag=${encodeURIComponent(q)}`);
    setQuery("");
    onHide();
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Buscar por tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup>
          <Form.Control
            placeholder="Ingresá el tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
          />
          <Button variant="primary" onClick={handleSearch}>
            <Search size={16} className="me-1" />
            Buscar
          </Button>
        </InputGroup>
      </Modal.Body>
    </Modal>
  );
}

export default SearchModal;
