import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SearchBar — premium search input with focus ring animation,
 * upload button, and loading indicator.
 */
export default function SearchBar({ query, onQueryChange, onUpload, isSearching }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  /* Keyboard shortcut: Ctrl+K or Cmd+K to focus search */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="search-bar-wrapper">
      {/* Search input container */}
      <motion.div
        className={`search-input-container ${isFocused ? "focused" : ""}`}
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(139, 92, 246, 0.5), 0 8px 32px rgba(139, 92, 246, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Search icon */}
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search your screenshots..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id="search-input"
        />

        {/* Loading spinner during search */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              className="search-spinner"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="spinner" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard shortcut hint */}
        {!isFocused && !query && (
          <span className="search-shortcut">Ctrl+K</span>
        )}
      </motion.div>

      {/* Upload button */}
      <label className="upload-btn" id="upload-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="upload-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>Upload</span>
        <input type="file" accept="image/*" onChange={onUpload} hidden />
      </label>
    </div>
  );
}
