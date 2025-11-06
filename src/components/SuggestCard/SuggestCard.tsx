import styles from './SuggestCard.module.css';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';

interface SuggestedUserProps {
  id: string;
  user: {
    name: string;
    username: string | undefined;
    avatar: string | undefined;
  };
  onFollowed?: (id: string) => void;
}

export function SuggestCard({ id, user, onFollowed }: SuggestedUserProps) {
  const { follow } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleFollow = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      if (typeof follow !== 'function') throw new Error('Follow helper not available');
      await follow(String(id));
      // notify parent to remove suggestion
      onFollowed?.(id);
    } catch (err) {
      console.warn('Follow failed', err);
    } finally {
      setProcessing(false);
    }
  };

  
  return (
    <div className={styles.containerSuggest}>
      <div className={styles.userInfo}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
        <div className={styles.userDetails}>
          <h3 className={styles.name}>
            <Link to={`/users/${user.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>{user.name}</Link>
          </h3>
          <p className={styles.username}>@{user.name}</p>
        </div>
      </div>
      <button className={styles.followButton} onClick={handleFollow} disabled={processing}>
        {processing ? 'Procesando...' : 'Seguir'}
      </button>
    </div>
  );
}
