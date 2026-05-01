import { motion } from "framer-motion";

const API_BASE = "http://127.0.0.1:8000";

/**
 * ImageCard — renders a single image thumbnail in the gallery grid.
 * Uses object-contain to prevent cropping, with hover scale + glow effect.
 */
export default function ImageCard({ image, index, onClick }) {
  return (
    <motion.div
      className="card"
      onClick={() => onClick(image)}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      id={`image-card-${index}`}
    >
      <div className="card-image-wrapper">
        <img
          src={`${API_BASE}/images/${image.image}`}
          alt={image.description || "Screenshot"}
          loading="lazy"
        />
      </div>
      {image.description && (
        <div className="card-caption">
          <p>{image.description.length > 80 ? image.description.slice(0, 80) + "…" : image.description}</p>
        </div>
      )}
    </motion.div>
  );
}
