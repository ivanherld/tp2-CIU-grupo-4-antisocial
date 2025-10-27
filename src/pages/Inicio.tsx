import { Button } from "react-bootstrap";
import styles from "./Inicio.module.css"
import { useNavigate } from "react-router-dom";

export default function Inicio() {

    const navigate = useNavigate()

  return (
    <div className={styles.inicioContainer}>
        <section className={styles.portada}>
            <h1>Bienvenido a <span>UnaHur Anti-Social Net</span></h1>
            <p>Conectá con personas, compartí tus ideas y descubrí nuevos contenidos.</p>
            <div className={styles.botones}>
                <Button className={styles.loginBtn} onClick={() => navigate("/login")}>Iniciar sesión</Button>
                <Button className={styles.registerBtn} onClick={() => navigate("/register")}>Registrarme</Button>
            </div>
        </section>
        <section className={styles.info}>
            <h2>¿Qué podés hacer acá?</h2>
            <ul>
                <li>Publicar tus pensamientos.</li>
                <li>Compartir fotos y momentos.</li>
                <li>Ver lo que otros comparten.</li>
            </ul>
        </section>
    </div>
  )
}
