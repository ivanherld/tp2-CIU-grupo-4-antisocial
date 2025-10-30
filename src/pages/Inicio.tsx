import {Container, Row} from "react-bootstrap";

import { useEffect } from "react";
import Portada from "../components/Portada/Portada";
import InfoInicio from "../components/InfoInicio/InfoInicio";

export default function Inicio() {

    useEffect(()=>{
        document.title = 'Inicio - Unahur Anti-Social Net'
    }, []);  

  return (
    <Container style={{textAlign: "center", padding: "4rem 2rem"}}>
        <Row className="align-items-center mb-5">
            <Portada/>
        </Row>
        <InfoInicio/>
    </Container>
  )
}
