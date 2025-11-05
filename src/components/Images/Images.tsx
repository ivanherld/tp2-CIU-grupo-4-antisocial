import { Link } from "react-router-dom";

interface ImageItem {
    url: string;
}

interface ImagesProps {
    imagenes?: ImageItem[];
    clickable?: boolean;
}


export default function Images({imagenes = [], clickable = false}: ImagesProps) {
    if(imagenes.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 my-2">
        {imagenes.map((img, i) => {
            const imageElement = (
                <img
                    src={img.url}
                    alt={`Imagen ${i + 1}`}
                    className="rounded shadow-sm"
                    style={{
                        maxWidth: "100%",
                        height:"auto",
                        maxHeight:"250px",
                        objectFit:"cover",
                        borderRadius:"0.5rem",
                    }}
                />
            );

            return clickable ? (
                <Link
                    key={i}
                    to={`/imagen/${encodeURIComponent(img.url)}`}
                    style={{display: "inline-block"}}
                >
                    {imageElement}
                </Link>
            ) : (
                <div key={i}>{imageElement}</div>
            )
        })}
    </div>
  )
}
