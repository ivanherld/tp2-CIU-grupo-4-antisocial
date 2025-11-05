import styles from './TrendingCard.module.css'

interface TrendingCardProps {
  nombre: string;
}

export function TrendingCard({ nombre }: TrendingCardProps) {
  return (
    <button className={styles.trendingCard}>
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