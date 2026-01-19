import torch
import clip
from PIL import Image
from pathlib import Path
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def get_embedding(image_path):
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
    with torch.no_grad():
        emb = model.encode_image(image)
    emb = emb / emb.norm(dim=-1, keepdim=True)
    return emb.cpu().numpy()

def build_embedding_db(image_folder, save_path="embeddings.npy"):
    image_folder = Path(image_folder)
    db = {}

    for img in image_folder.glob("*.jpg"):
        db[img.name] = get_embedding(img)

    np.save(save_path, db)
    print("Saved embeddings to:", save_path)

if __name__ == "__main__":
    build_embedding_db("data/processed/images")
