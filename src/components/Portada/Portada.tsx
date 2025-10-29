import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./Portada.module.css"
import antisocialpng from "../../assets/antisocialpng.png"


export default function Portada() {
    const navigate = useNavigate()

  return (
    <>
        <Col md={6}>
        <figure className={styles.aparicion}>
            <img src={antisocialpng} alt="UnaHur Anti-Social Net" className={styles.portadaImg}/>
        </figure>
        </Col>
        <Col md={6}>
            <p className={styles.descripcion}>Conectá con personas, compartí tus ideas y descubrí nuevos contenidos</p>
            <div className={styles.botones}>
                <Button className={styles.loginBtn} onClick={() => navigate("/login")}>Iniciar sesión</Button>
                <Button className={styles.registerBtn} onClick={() => navigate("/register")}>Registrarme</Button>
            </div>
        </Col>
    </>
  )
}
