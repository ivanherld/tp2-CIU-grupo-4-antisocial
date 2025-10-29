import styles from '../pages/Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <span className={styles.brand}>Unahur Anti-Social Net</span>
                <small className={styles.copy}>© {new Date().getFullYear()} Unahur</small>
                <nav className={styles.nav}>
                    <a href="/about">Acerca</a>
                    <a href="/terms">Términos</a>
                    <a href="/help">Ayuda</a>
                </nav>
                
            </div>
        </footer>
    );
}


export default Footer;