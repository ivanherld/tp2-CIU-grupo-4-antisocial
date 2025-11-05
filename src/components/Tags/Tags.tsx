import styles from "./Tags.module.css"

export interface Tag {id: string; name: string}

export default function Tags({tags}: {tags:Tag[]}) {

    if(!tags || tags.length === 0) return null;

  return (
    <div className={styles.tags}>
        {tags.map(t => (
            <span key={t.id} className={styles.tag}>#{t.name}</span>
        ))}
    </div>
  )
}
