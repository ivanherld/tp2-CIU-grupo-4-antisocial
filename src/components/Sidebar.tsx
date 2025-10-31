import { Card, Image, Button, ListGroup } from "react-bootstrap";

function Sidebar({
  currentUser,
}: {
  currentUser?: { username?: string; displayName?: string; avatarUrl?: string } | null;
}) {
  return (
    <div style={{ width: 260 }}>
      <Card className="mb-3">
        <Card.Body className="d-flex align-items-center gap-2">
          <Image
            src={currentUser?.avatarUrl ?? "https://i.pravatar.cc/80?img=5"}
            roundedCircle
            width={56}
            height={56}
            alt="avatar"
          />
          <div>
            <div className="fw-semibold">{currentUser?.displayName ?? "Tú"}</div>
            <div className="text-muted">@{currentUser?.username ?? "usuario"}</div>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <ListGroup variant="flush">
          <ListGroup.Item action href="#home">Inicio</ListGroup.Item>
          <ListGroup.Item action href="#search">Buscar</ListGroup.Item>
          <ListGroup.Item action href="#notifications">Notificaciones</ListGroup.Item>
          <ListGroup.Item action href="#messages">Mensajes</ListGroup.Item>
        </ListGroup>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">Sugerencias</Card.Subtitle>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Image src="https://i.pravatar.cc/40?img=10" rounded width={40} height={40} />
                <div>
                  <div className="fw-semibold">ana</div>
                  <small className="text-muted">@ana</small>
                </div>
              </div>
              <Button size="sm" variant="outline-primary">Seguir</Button>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Image src="https://i.pravatar.cc/40?img=20" rounded width={40} height={40} />
                <div>
                  <div className="fw-semibold">marcos</div>
                  <small className="text-muted">@marcos</small>
                </div>
              </div>
              <Button size="sm" variant="outline-primary">Seguir</Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <small className="text-muted d-block mt-3">Unahur Anti-Social • Demo</small>
    </div>
  );
}

export default Sidebar;