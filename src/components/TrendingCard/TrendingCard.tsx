import styles from './TrendingCard.module.css'

interface TrendingCardProps {
  topic: string;
  posts: string;
}

export function TrendingCard({ topic, posts }: TrendingCardProps) {
  return (
    <button className={styles.trendingCard}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.label}>Tendencia</p>
          <h3 className={styles.topic}>#{topic}</h3>
          <p className={styles.posts}>{posts} publicaciones</p>
        </div>
      </div>
    </button>
  );
}