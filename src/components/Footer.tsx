import styles from '../pages/Footer.module.css';
import logo from '../assets/antisocialpng.png';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <span className={styles.brand}><img src={logo} alt="logo" className={styles.logo} /></span>
                <small className={styles.copy}>© {new Date().getFullYear()} Grupo 4 CIU</small>
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