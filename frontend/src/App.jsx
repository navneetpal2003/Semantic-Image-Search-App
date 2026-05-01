import { useState, useEffect } from "react";
import { uploadImage, searchImages } from "./Api";
import "./styles.css";

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const loadAllImages = async () => {
    const res = await searchImages("");
    setImages(res.data.results);
  };

  useEffect(() => {
    loadAllImages();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await uploadImage(file);
    loadAllImages();
  };

  const handleSearch = async (value) => {
    const res = await searchImages(value);
    setImages(res.data.results);
  };

  return (
    <div className="container">

      {/* TOP BAR */}
      <div className="top-section">

        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);

            if (value.trim() === "") {
              loadAllImages();
            } else {
              handleSearch(value);
            }
          }}
        />

        <label className="upload-btn">
          Upload
          <input type="file" onChange={handleUpload} hidden />
        </label>

      </div>

      {/* GALLERY */}
      <div className="gallery">
        {images.map((img, i) => (
          <div
            key={i}
            className="card"
            onClick={() => setSelectedImage(img)}
          >
            <img src={`http://127.0.0.1:8000/images/${img.image}`} />
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div className="overlay" onClick={() => setSelectedImage(null)}>

          <div className="popup-card" onClick={(e) => e.stopPropagation()}>

            {/* CLOSE BUTTON */}
            <button
              className="close-btn"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            {/* LEFT IMAGE */}
            <div className="popup-left">
              <img
                src={`http://127.0.0.1:8000/images/${selectedImage.image}`}
                alt="img"
              />
            </div>

            {/* RIGHT DESCRIPTION */}
            <div className="popup-right">
              <h2>Image Details</h2>
              <p>{selectedImage.description}</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;