import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://127.0.0.1:8000";

/**
 * ImageModal — full-screen overlay modal with split layout:
 *   LEFT  → full image (object-contain, no cropping)
 *   RIGHT → description + metadata panel
 * Supports ESC key close, backdrop click close, and close button.
 */
export default function ImageModal({ image, onClose }) {
  /* ESC key to close */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden"; // prevent background scroll
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          id="image-modal-overlay"
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              id="modal-close-button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* LEFT — Image section */}
            <div className="modal-image-section">
              <img
                src={`${API_BASE}/images/${image.image}`}
                alt={image.description || "Screenshot"}
              />
            </div>

            {/* RIGHT — Details panel */}
            <div className="modal-details-section">
              <div className="modal-details-header">
                <div className="modal-badge">AI Description</div>
                <h2 className="modal-title">Image Details</h2>
              </div>

              <div className="modal-description">
                <p>{image.description || "No description available for this image."}</p>
              </div>

              <div className="modal-meta">
                <div className="modal-meta-item">
                  <span className="meta-label">Filename</span>
                  <span className="meta-value">{image.image}</span>
                </div>
                {image.score !== undefined && (
                  <div className="modal-meta-item">
                    <span className="meta-label">Relevance</span>
                    <div className="relevance-bar-track">
                      <motion.div
                        className="relevance-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(image.score * 100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <span className="meta-value">{Math.round(image.score * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
