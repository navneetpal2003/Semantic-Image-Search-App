import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from pipeline import process_image, search_images

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = "../images"


@app.get("/")
def home():
    return {"message": "Screenshot Semantic Search API"}


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    result = process_image(file_path)

    return result


@app.get("/search")
def search(query: str):

    results = search_images(query)

    return results