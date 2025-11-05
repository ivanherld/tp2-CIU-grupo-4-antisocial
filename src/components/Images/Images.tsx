

interface ImageItem {
    url: string;
}

interface ImagesProps {
    imagenes?: ImageItem[];
}


export default function Images({imagenes = []}: ImagesProps) {
    if(imagenes.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 my-2">
        {imagenes.map((img, i) => (
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
        ))}
    </div>
  )
}
