import { Col, Container, Row } from "react-bootstrap";
import antisocialnet from "../assets/antisocialnet.jpg";
import antisocialpng from "../assets/antisocialpng.png";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./AuthCard.module.css"

interface AuthCardProps {
    titulo: string
    mostrarLink?: boolean
    textoLink?: string
    rutaLink?: string
    children: ReactNode
}


export default function AuthCard({
    titulo,
    mostrarLink = false,
    textoLink,
    rutaLink,
    children,
}: AuthCardProps) {
  return (
    <div className={styles.contenedorLogin}>
      <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <Row className={`mt-4 mb-4 ${styles.loginCardContenedor}`}>
          <Col md={5} className="d-none d-md-block p-0" style={{backgroundColor: "#d7d6d6"}}>
            <img src={antisocialnet} alt="UnaHur Anti-Social Net" className="img-fluid h-100 w-100" style={{objectFit: "contain"}}/>
          </Col>

          <Col md={7} className="d-flex justify-content-center align-items-start">
            <div className={styles.divForm}>
              <div className={styles.mobileLogo}>
                <img src={antisocialpng} alt="Logo"/>
              </div>
              <h2>{titulo}</h2>
              {mostrarLink && textoLink && rutaLink && (
                <><p className="mb-o d-inline">{textoLink}</p>
                <Link to={rutaLink} className={`${styles.link} ms-1`}>Registrarse</Link></>
              )}
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
