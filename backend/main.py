import os
import base64
import requests
import numpy as np
import faiss
import pickle
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# ------------------ LOAD ENV ------------------
load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

IMAGE_FOLDER = "images"
DATA_FILE = "data/store.pkl"

# NVIDIA API
NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {NVIDIA_API_KEY}",
    "Content-Type": "application/json"
}

# ------------------ EMBEDDING MODEL ------------------
print("Loading embedding model...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")


# ------------------ IMAGE → TEXT ------------------
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
                    {"type": "text", "text": "Describe this image for semantic search"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    }

    res = requests.post(NVIDIA_URL, headers=HEADERS, json=payload)
    data = res.json()

    return data["choices"][0]["message"]["content"]


# ------------------ CLEAN ------------------
def clean_text(text):
    return text.replace("\n", " ").lower()


# ------------------ EMBEDDING ------------------
def get_embedding(text):
    return embed_model.encode(text)


# ------------------ SAVE DATA ------------------
def save_data(index, paths, descs):
    with open(DATA_FILE, "wb") as f:
        pickle.dump((index, paths, descs), f)


# ------------------ LOAD DATA ------------------
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "rb") as f:
            return pickle.load(f)
    return None


# ------------------ BUILD INDEX ------------------
def build_index():

    embeddings = []
    paths = []
    descs = []

    for img in os.listdir(IMAGE_FOLDER):

        path = os.path.join(IMAGE_FOLDER, img)

        print(f"\nProcessing {img}...")

        desc = image_to_text(path)
        print("Desc:", desc)

        emb = get_embedding(clean_text(desc))

        embeddings.append(emb)
        paths.append(path)
        descs.append(desc)

    dim = len(embeddings[0])

    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype("float32"))

    save_data(index, paths, descs)

    return index, paths, descs


# ------------------ SEARCH ------------------
def search(index, paths, descs, query):

    print(f"\nQuery: {query}")

    q_emb = get_embedding(clean_text(query))

    D, I = index.search(
        np.array([q_emb]).astype("float32"), 5
    )

    for rank, i in enumerate(I[0]):
        print(f"\nRank {rank+1}")
        print("Image:", paths[i])
        print("Desc:", descs[i])


# ------------------ MAIN ------------------
if __name__ == "__main__":

    data = load_data()

    if data:
        print("Loading saved data...")
        index, paths, descs = data
    else:
        print("Building new index...")
        index, paths, descs = build_index()

    while True:
        q = input("\nSearch: ")
        search(index, paths, descs, q)