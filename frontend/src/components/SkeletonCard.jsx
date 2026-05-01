import { motion } from "framer-motion";

/**
 * SkeletonCard — loading placeholder with shimmer animation.
 * Renders a grid of skeleton cards while images are being fetched.
 */
export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="gallery">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="skeleton-image" />
          <div className="skeleton-text">
            <div className="skeleton-line wide" />
            <div className="skeleton-line narrow" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
