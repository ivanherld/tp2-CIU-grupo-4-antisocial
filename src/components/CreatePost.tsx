import React from 'react';
import styles from '../styles/css/CreatePost.module.css'
import { Image } from 'lucide-react';

export const CreatePost: React.FC = () => {
  return (
    <div className={styles.postboxContainer}>
      <div className={styles.postboxAvatar}>U</div>
      <textarea
        className={styles.postboxInput}
        placeholder="¿Qué estás pensando?"
      />
      <div className={styles.postboxFooter}>
        <button className={styles.postboxImageButton} title="Agregar imagen">
          <Image />
        </button>
        <button className={styles.postboxPublishButton}>Publicar</button>
      </div>
    </div>
  );
};

