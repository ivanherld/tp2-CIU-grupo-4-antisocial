import styles from "./Nosotros.module.css"
import comunidad from "../assets/comunidad.svg"


export default function Nosotros() {
  return (
    <section className={styles.contenedor}>
        <h2>Sobre nosotros</h2>
        <article>
            <p>Bienvenido a <strong>UnaHur Anti-Social Net</strong>, un espacio creado para que puedas compartir tus ideas, momentos y pensamientos con otras personas.</p>
            <p>Nuestra misión es ofrecer un lugar simple, seguro y positivo, donde todos puedan expresarse y descubrir contenido nuevo cada día.</p>
            <p>Queremos que te sientas parte de una comunidad auténtica, donde lo más importante es compartir y conectar de manera genuina.</p>
        </article>
        <figure className={styles.imgContenedor}>
            <img src={comunidad} alt="Comunidad"/>
        </figure>
    </section>
  )
}
