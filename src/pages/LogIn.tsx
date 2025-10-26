import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FormLogin from "../components/FormLogin";
import styles from "./LogIn.module.css"
import unahurimg from "../assets/unahurimg.jpg";
import {Link} from "react-router-dom"

function LogIn() {

  useEffect(()=>{
    document.title = 'LogIn - Unahur Anti-Social Net'
  }, []);  


  return (
    <main>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Row className={styles.loginCardContainer}>
          <Col md={5} className="d-none d-md-block p-0">
            <img src={unahurimg} alt="Login" className="img-fluid h-100 w-100" style={{objectFit: "cover"}}/>
          </Col>

          <Col md={7} className="d-flex justify-content-center align-items-start">
            <div className={styles.divForm}>
              <h2>Iniciar sesión</h2>
              <p className="mb-o d-inline">No tenés una cuenta?</p> 
              <Link to= "/register" className={`${styles.link} ms-1`}>Registrarse</Link>
              <FormLogin/>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default LogIn
