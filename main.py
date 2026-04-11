import os
import torch
import easyocr
from PIL import Image

# transformers
from transformers import BlipProcessor, BlipForConditionalGeneration

# embeddings
from sentence_transformers import SentenceTransformer

# langchain
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings


# ----------------------------
# DEVICE
# ----------------------------

device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)


# ----------------------------
# BLIP MODEL
# ----------------------------

print("Loading BLIP...")

processor = BlipProcessor.from_pretrained(
    "Salesforce/blip-image-captioning-base"
)

model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
).to(device)


# ----------------------------
# OCR
# ----------------------------

print("Loading EasyOCR...")

ocr_reader = easyocr.Reader(['en'])


# ----------------------------
# EMBEDDING MODEL
# ----------------------------

print("Loading Embeddings...")

sentence_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2",
    device=device
)

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ----------------------------
# VECTOR DB
# ----------------------------

vector_db = Chroma(
    collection_name="image_db",
    embedding_function=embedding_model,
    persist_directory="./vector_db"
)


# ----------------------------
# OCR FUNCTION
# ----------------------------

def extract_text(image_path):

    results = ocr_reader.readtext(image_path)
    text = " ".join([r[1] for r in results])

    return text


# ----------------------------
# CAPTION FUNCTION
# ----------------------------

def generate_caption(image_path):

    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        image,
        return_tensors="pt"
    ).to(device)

    output = model.generate(
        **inputs,
        max_new_tokens=40
    )

    caption = processor.decode(
        output[0],
        skip_special_tokens=True
    )

    return caption


# ----------------------------
# TAG GENERATION (NEW METHOD)
# ----------------------------

def generate_tags(text):

    words = list(set(text.lower().split()))

    embeddings = sentence_model.encode(words)

    # select top keywords
    tags = words[:8]

    return tags


# ----------------------------
# PROCESS IMAGE
# ----------------------------

def process_image(image_path):

    print("\nProcessing:", image_path)

    caption = generate_caption(image_path)

    ocr_text = extract_text(image_path)

    combined_text = caption + " " + ocr_text

    tags = generate_tags(combined_text)

    final_text = combined_text + " " + " ".join(tags)

    doc = Document(
        page_content=final_text,
        metadata={
            "image_path": image_path,
            "tags": tags,
            "caption": caption
        }
    )

    vector_db.add_documents([doc])

    print("Caption:", caption)
    print("Tags:", tags)


# ----------------------------
# SEARCH
# ----------------------------

def search_images(query):

    print("\nSearching:", query)

    results = vector_db.similarity_search(query, k=3)

    for r in results:

        print("\nImage:", r.metadata["image_path"])
        print("Tags:", r.metadata["tags"])
        print("Caption:", r.metadata["caption"])


# ----------------------------
# MAIN
# ----------------------------

def main():

    image_folder = "images"

    for file in os.listdir(image_folder):

        if file.lower().endswith((".png",".jpg",".jpeg")):

            path = os.path.join(image_folder, file)

            process_image(path)

    search_images("instagram profile")


if __name__ == "__main__":
    main()