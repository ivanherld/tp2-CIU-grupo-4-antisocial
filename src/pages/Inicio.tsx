import { Button, Container, Row, Col } from "react-bootstrap";
import styles from "./Inicio.module.css"
import { useNavigate } from "react-router-dom";
import antisocialpng from "../assets/antisocialpng.png"
import { useEffect } from "react";

export default function Inicio() {

    const navigate = useNavigate()

    useEffect(()=>{
        document.title = 'Inicio - Unahur Anti-Social Net'
    }, []);  

  return (
    <Container className={styles.inicioContenedor}>
        <Row className="align-items-center mb-5">
            <Col md={6}>
                <img src={antisocialpng} alt="UnaHur Anti-Social Net" className={styles.portadaImg}/>
            </Col>
            <Col md={6}>
                <p className={styles.descripcion}>Conectá con personas, compartí tus ideas y descubrí nuevos contenidos</p>
                <div className={styles.botones}>
                    <Button className={styles.loginBtn} onClick={() => navigate("/login")}>Iniciar sesión</Button>
                    <Button className={styles.registerBtn} onClick={() => navigate("/register")}>Registrarme</Button>
                </div>
            
            </Col>
        </Row>
        <section className={styles.info}>
            <h2>¿Qué podés hacer acá?</h2>
            <ul>
                <li>Publicar tus pensamientos.</li>
                <li>Compartir fotos y momentos.</li>
                <li>Ver lo que otros comparten.</li>
            </ul>
        </section>
    </Container>
  )
}
