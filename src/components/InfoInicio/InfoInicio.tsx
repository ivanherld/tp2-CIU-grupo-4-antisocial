import styles from "./InfoInicio.module.css"


export default function InfoInicio() {
  return (
    <section className={styles.info}>
        <h2>¿Qué podés hacer acá?</h2>
        <ul>
            <li>Publicar tus pensamientos.</li>
            <li>Compartir fotos y momentos.</li>
            <li>Ver lo que otros comparten.</li>
        </ul>
    </section>
  )
}
