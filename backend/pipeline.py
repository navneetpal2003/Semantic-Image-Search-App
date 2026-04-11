import os
import torch
import easyocr
from PIL import Image

from transformers import BlipProcessor, BlipForConditionalGeneration
from sentence_transformers import SentenceTransformer

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings


device = "cuda" if torch.cuda.is_available() else "cpu"

processor = BlipProcessor.from_pretrained(
    "Salesforce/blip-image-captioning-base"
)

model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
).to(device)

ocr_reader = easyocr.Reader(['en'])

sentence_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2",
    device=device
)

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = Chroma(
    collection_name="image_db",
    embedding_function=embedding_model,
    persist_directory="../vector_db"
)


def extract_text(image_path):

    results = ocr_reader.readtext(image_path)
    text = " ".join([r[1] for r in results])

    return text


def generate_caption(image_path):

    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        image,
        return_tensors="pt"
    ).to(device)

    output = model.generate(**inputs, max_new_tokens=40)

    caption = processor.decode(
        output[0],
        skip_special_tokens=True
    )

    return caption


def generate_tags(text):

    words = list(set(text.lower().split()))

    tags = words[:8]

    return tags


def process_image(image_path):

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

    return {
        "caption": caption,
        "tags": tags
    }


def search_images(query):

    results = vector_db.similarity_search(query, k=3)

    output = []

    for r in results:

        output.append({
            "image": r.metadata["image_path"],
            "tags": r.metadata["tags"],
            "caption": r.metadata["caption"]
        })

    return output