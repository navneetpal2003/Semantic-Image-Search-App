import { motion } from "framer-motion";

/**
 * EmptyState — displayed when no images match the search query
 * or the gallery is empty.
 */
export default function EmptyState({ query }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-state-icon">
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="12" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <path d="M8 44l14-14 10 10 8-8 16 16" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <line x1="42" y1="22" x2="54" y2="34" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
          <line x1="54" y1="22" x2="42" y2="34" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
        </svg>
      </div>
      <h3 className="empty-state-title">
        {query ? "No results found" : "No images yet"}
      </h3>
      <p className="empty-state-desc">
        {query
          ? `We couldn't find any screenshots matching "${query}". Try a different search term.`
          : "Upload your first screenshot to get started with AI-powered semantic search."}
      </p>
    </motion.div>
  );
}
