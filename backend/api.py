import os
import base64
import requests
import numpy as np
import faiss
import pickle
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from PIL import Image

# ---------------- INIT ----------------
load_dotenv()
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static images
app.mount("/images", StaticFiles(directory="images"), name="images")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

IMAGE_FOLDER = "images"
DATA_FILE = "data/store.pkl"

os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs("data", exist_ok=True)

NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {NVIDIA_API_KEY}",
    "Content-Type": "application/json"
}

# ---------------- EMBEDDING ----------------
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

index = None
paths = []
descs = []

def clean_text(text):
    return text.replace("\n", " ").lower()

def get_embedding(text):
    return embed_model.encode(text)

def save_data():
    with open(DATA_FILE, "wb") as f:
        pickle.dump((index, paths, descs), f)

def load_data():
    global index, paths, descs
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "rb") as f:
            index, paths, descs = pickle.load(f)
            print("Data loaded")

# ---------------- IMAGE → TEXT (VISION OCR + CONTEXT) ----------------
def image_to_text(image_path):

    with open(image_path, "rb") as f:
        img_bytes = f.read()

    base64_image = base64.b64encode(img_bytes).decode("utf-8")

    payload = {
        "model": "meta/llama-3.2-11b-vision-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Analyze this image carefully.

1. Identify app / object / context (very important)
2. Extract ALL visible text from image (OCR)
3. Return only short keywords

Example outputs:
instagram profile followers bio
youtube video bgmi gameplay
math notes integration formula
amazon order receipt 2300 rs

Do NOT write sentences."""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "temperature": 0.2,
        "max_tokens": 150
    }

    res = requests.post(NVIDIA_URL, headers=HEADERS, json=payload)
    data = res.json()

    if "choices" in data:
        return data["choices"][0]["message"]["content"]
    else:
        print("API error:", data)
        return "unknown"


# ---------------- INDEX ----------------
def add_to_index(image_path):
    global index, paths, descs

    desc = image_to_text(image_path)
    print("Generated:", desc)

    emb = get_embedding(clean_text(desc))
    emb = np.array([emb]).astype("float32")

    if index is None:
        index = faiss.IndexFlatL2(emb.shape[1])

    index.add(emb)
    paths.append(image_path)
    descs.append(desc)

    save_data()


@app.on_event("startup")
def startup():
    load_data()


# ---------------- UPLOAD ----------------
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    try:
        image = Image.open(file.file)
        image.verify()
        file.file.seek(0)

        file_path = os.path.join(IMAGE_FOLDER, file.filename)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        add_to_index(file_path)

        return {"message": "Uploaded"}

    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


# ---------------- SEARCH ----------------
@app.post("/search")
async def search(query: str = ""):

    if index is None:
        return {"results": []}

    # 🔥 empty query → show all
    if query.strip() == "":
        return {
            "results": [
                {
                    "image": os.path.basename(p),
                    "description": d
                }
                for p, d in zip(paths, descs)
            ]
        }

    query_lower = query.lower()

    q_emb = get_embedding(clean_text(query))
    q_emb = np.array([q_emb]).astype("float32")

    D, I = index.search(q_emb, 10)

    results = []
    THRESHOLD = 1.2

    for dist, i in zip(D[0], I[0]):
        desc_text = descs[i].lower()

        # 🔥 HYBRID FILTER (perfect accuracy)
        if query_lower in desc_text and dist < THRESHOLD:
            results.append({
                "image": os.path.basename(paths[i]),
                "description": descs[i]
            })

    return {"results": results}