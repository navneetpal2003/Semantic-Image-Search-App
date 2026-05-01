import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { uploadImage, searchImages } from "./Api";
import SearchBar from "./components/SearchBar";
import ImageCard from "./components/ImageCard";
import ImageModal from "./components/ImageModal";
import SkeletonGrid from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import "./styles.css";

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const debounceRef = useRef(null);

  const loadAllImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await searchImages("");
      setImages(res.data.results);
    } catch (err) {
      console.error("Failed to load images:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllImages();
  }, [loadAllImages]);

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.trim() === "") {
        loadAllImages();
        return;
      }
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await searchImages(value);
          setImages(res.data.results);
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setIsSearching(false);
        }
      }, 350);
    },
    [loadAllImages]
  );

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadImage(file);
      await loadAllImages();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#bg)" />
                <path d="M10 22l5-7 4 5 3-4 4 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2.5" fill="#fff" opacity="0.9" />
                <defs>
                  <linearGradient id="bg" x1="2" y1="2" x2="30" y2="30">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6D28D9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="brand-name">ScreenSorts</h1>
              <p className="brand-tagline">AI-powered screenshot search</p>
            </div>
          </div>
          <div className="header-stats">
            {!isLoading && (
              <span className="stat-badge">{images.length} {images.length === 1 ? "image" : "images"}</span>
            )}
          </div>
        </div>
      </header>

      <div className="search-section">
        <SearchBar query={query} onQueryChange={handleQueryChange} onUpload={handleUpload} isSearching={isSearching} />
      </div>

      {isUploading && (
        <div className="upload-progress">
          <div className="upload-progress-bar" />
          <span>Processing upload…</span>
        </div>
      )}

      <main className="gallery-section">
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : images.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="gallery">
            <AnimatePresence mode="popLayout">
              {images.map((img, i) => (
                <ImageCard key={img.image || i} image={img} index={i} onClick={setSelectedImage} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}

export default App;