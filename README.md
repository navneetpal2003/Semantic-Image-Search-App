# Semantic Image Search App

An AI-powered semantic image retrieval system that allows users to search images using natural language instead of filenames or metadata.

The application understands:

* Objects inside images
* Social media screenshots
* UI screenshots
* Notes and handwritten text
* OCR text
* Documents
* Semantic meaning of images

Users can upload images and later search them using queries like:

```bash
instagram profile
leetcode badge
bike
notes with handwriting
youtube screenshot
coding problem
```

---

# Features

* Semantic image search
* OCR-aware image understanding
* Natural language search
* Vision AI-based descriptions
* Fast vector similarity search
* Image upload support
* Modern responsive UI
* Popup image preview
* Full-stack deployment

---

# Tech Stack

## Frontend

* React
* Axios
* CSS
* Vite

## Backend

* FastAPI
* Python
* Uvicorn
* NumPy
* Pillow

## AI / ML

* Sentence Transformers
* FAISS Vector Search
* NVIDIA LLaMA Vision Model

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Project Architecture

```text
Frontend (React)
        ↓
FastAPI Backend
        ↓
Vision Model Processing
        ↓
Embedding Generation
        ↓
FAISS Vector Database
        ↓
Semantic Search Results
```

---

# How It Works

## 1. Image Upload

When a user uploads an image:

```text
Image Upload
    ↓
Vision Model analyzes image
    ↓
Detailed description generated
    ↓
Embedding vector created
    ↓
Stored inside FAISS index
```

The system extracts:

* image meaning
* objects
* text inside image
* UI understanding
* semantic context

---

## 2. Search Flow

When a user searches:

```text
Search Query
    ↓
Query converted into embedding
    ↓
FAISS similarity search
    ↓
Most relevant images returned
```

The search is semantic, not keyword-based.

Example:

An Instagram screenshot can be found using:

```bash
instagram
social media profile
dark ui screenshot
```

without manually tagging the image.

---

# Folder Structure

```text
Semantic-Image-Search-App/
│
├── backend/
│   ├── api.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── images/
│   └── data/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── styles.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Backend Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/Semantic-Image-Search-App.git
```

---

## 2. Move to Backend

```bash
cd Semantic-Image-Search-App/backend
```

---

## 3. Create Virtual Environment

```bash
python -m venv venv
```

---

## 4. Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 6. Run Backend

```bash
uvicorn api:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

## 1. Move to Frontend

```bash
cd frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Run Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# API Endpoints

## Upload Image

```http
POST /upload
```

Uploads image and creates semantic embeddings.

---

## Search Images

```http
POST /search
```

Search images using natural language.

Example:

```bash
instagram profile
bike
certificate
notes
```

---

# AI Pipeline

## Vision Understanding

The system uses a vision-capable LLM to generate detailed descriptions of uploaded images.

Example generated description:

```text
The image shows an Instagram profile page with dark theme UI and follower statistics.
```

---

## Embedding Generation

Descriptions are converted into embeddings using:

```python
SentenceTransformer("all-MiniLM-L6-v2")
```

---

## Vector Search

Embeddings are stored inside:

```text
FAISS Vector Index
```

FAISS enables:

* fast similarity search
* semantic retrieval
* scalable vector operations

---

# Supported Image Types

* PNG
* JPG
* JPEG
* Screenshots
* Notes
* UI Images
* Social Media Screenshots
* Documents

---

# Deployment

## Frontend Deployment

Deploy frontend using:

```text
Vercel
```

---

## Backend Deployment

Deploy backend using:

```text
Render
```

---

# Example Searches

```bash
instagram
coding screenshot
bike
certificate
notes
mountain
social media ui
```

---

# Future Improvements

* Cloud storage integration
* Multi-user authentication
* Advanced vector databases
* Hybrid semantic + keyword search
* Faster embedding pipelines
* Category filtering

---

# Author

```text
Nav Neet Pal
```
