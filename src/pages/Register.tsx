import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./LogIn.module.css"
import antisocialnet from "../assets/antisocialnet.jpg";
//import antisocialpng from "../assets/antisocialpng.png";
import FormRegister from "../components/FormRegister";

function Register() {
  useEffect(() => {
    document.title = "Register - Unahur Anti-Social Net";
  }, []);
  return (
     <main>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Row className={styles.loginCardContainer}>
          <Col md={5} className="d-none d-md-block p-0">
            <img src={antisocialnet} alt="Login" className="img-fluid h-100 w-100" style={{objectFit: "cover"}}/>
          </Col>

          <Col md={7} className="d-flex justify-content-center align-items-start">
            <div className={styles.divForm}>
              <h2>Registro</h2>
              <FormRegister/>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
export default Register;
