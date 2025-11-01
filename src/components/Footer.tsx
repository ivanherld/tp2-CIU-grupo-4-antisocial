import styles from '../pages/Footer.module.css';
import logo from '../assets/antisocialpng.png';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <span className={styles.brand}><img src={logo} alt="logo" className={styles.logo} /></span>
                <small className={styles.copy}>© {new Date().getFullYear()} Grupo 4 CIU</small>
                <nav className={styles.nav}>
                    <Link to="/about">Acerca</Link>
                    <Link to="/terms">Términos</Link>
                    <Link to="/help">Ayuda</Link>
                </nav>
                
            </div>
        </footer>
    );
}


export default Footer;