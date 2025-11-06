import styles from './TrendingCard.module.css'
import { useNavigate } from 'react-router-dom';
interface TrendingCardProps {
  nombre: string;
}

export function TrendingCard({ nombre }: TrendingCardProps) {
  const navigate = useNavigate();

  function doSearch(nombre: string) {
    navigate(`/feed?tag=${encodeURIComponent(nombre)}`)
  }

  return (
    <button onClick={() => doSearch(nombre)} className={styles.trendingCard}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.label}>Tendencia</p>
          <h3 className={styles.topic}>#{nombre}</h3>
          {/* <p className={styles.posts}>{posts} publicaciones</p> */}
        </div>
      </div>
    </button>
  );
}