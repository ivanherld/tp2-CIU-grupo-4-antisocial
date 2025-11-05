import styles from './SuggestCard.module.css';

interface SuggestedUserProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
}

export function SuggestCard({ user }: SuggestedUserProps) {
  return (
    <div className={styles.containerSuggest}>
      <div className={styles.userInfo}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
        <div className={styles.userDetails}>
          <h3 className={styles.name}>{user.name}</h3>
          <p className={styles.username}>{user.username}</p>
        </div>
      </div>
      <button className={styles.followButton}>
        Seguir
      </button>
    </div>
  );
}
