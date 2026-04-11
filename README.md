🧠 Screenshot Semantic Search Engine

An AI-powered screenshot search system that automatically understands images, generates semantic tags, creates embeddings, and enables natural language search over screenshots.

This project uses Generative AI + Computer Vision + Semantic Search to allow users to search screenshots by meaning, not filenames.

🚀 Features
🔍 Semantic search for screenshots
🏷️ Automatic tag generation
🧠 AI-based screenshot understanding
🔤 OCR text extraction from screenshots
⚡ Fast vector search using embeddings
🧩 Modular architecture
💻 Works locally (no paid APIs)
🧪 Fully open-source stack
🧠 Example
Input Screenshots
Instagram profile
Spotify playlist
VSCode screen
YouTube page
Search Queries
instagram profile
music playlist
coding screen
youtube video
Output

System returns relevant screenshots using semantic search.

🏗️ Architecture
Screenshot
   │
   ├── BLIP → Caption generation
   │
   ├── EasyOCR → Text extraction
   │
   ▼
Combine caption + OCR text
   │
   ▼
Tag generation
   │
   ▼
Embeddings (MiniLM)
   │
   ▼
Chroma Vector DB
   │
   ▼
Semantic Search
🧰 Tech Stack
Backend
Python
LangChain
ChromaDB
AI Models
Component	Model
Image Caption	BLIP
OCR	EasyOCR
Embeddings	all-MiniLM-L6-v2
Vector DB	Chroma
Libraries
transformers
sentence-transformers
easyocr
langchain
chromadb
pillow
torch
📁 Project Structure
screenshot_semantic_search/

│
├── venv/
├── images/
│   ├── image1.png
│   ├── image2.png
│
├── vector_db/
│
├── main.py
├── requirements.txt
└── README.md
⚙️ Installation
1️⃣ Clone Project
git clone <your-repo>
cd screenshot_semantic_search
2️⃣ Create Virtual Environment

Windows

python -m venv venv

Activate

venv\Scripts\activate
3️⃣ Install Dependencies
pip install -r requirements.txt
▶️ Run Project

Place screenshots inside:

images/

Then run:

python main.py
🔍 How It Works
Step 1 — Image Processing

Each image is processed using:

Caption generation (BLIP)
OCR text extraction (EasyOCR)

Example:

Image: Instagram Profile

Generated:

Caption: social media profile page
OCR: username followers bio
Step 2 — Tag Generation

System extracts meaningful tags:

instagram
profile
followers
social media
account
Step 3 — Embedding Creation

Tags + Caption converted into vector embeddings using:

sentence-transformers/all-MiniLM-L6-v2
Step 4 — Store in Vector Database

Embeddings stored in:

Chroma Vector DB
Step 5 — Semantic Search

User query:

music playlist

System:

Converts query → embedding
Searches vector DB
Returns closest matches
🧪 Example Output
Processing: images/spotify.png

Caption:
music player showing playlist

Tags:
spotify
music
playlist
songs
album

Search:

search_images("music playlist")

Result:

images/spotify.png
🎯 Use Cases
Screenshot search
Personal knowledge base
AI file search
Research screenshot management
Developer screenshot search
Note screenshot search
🔥 Why This Project is Powerful
Uses GenAI
Uses Semantic Search
Uses Embeddings
Uses Computer Vision
Works offline
Production-ready architecture
🚀 Future Improvements
FastAPI backend
React frontend
Batch processing
UI search interface
Multi-modal search
CLIP integration
📊 Model Size
Model	Size
BLIP	~400MB
EasyOCR	~250MB
MiniLM	~90MB

Works on:

8GB RAM
GTX 1650
CPU fallback
