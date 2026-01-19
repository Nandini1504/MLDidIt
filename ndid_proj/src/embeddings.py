import torch
import clip
from PIL import Image
from pathlib import Path
import pandas as pd
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)
model.eval()

BASE = Path(__file__).resolve().parents[1] / "data" / "raw"
CSV_PATH = BASE / "subset_500.csv"
OUT_DIR = BASE / "features"
OUT_DIR.mkdir(exist_ok=True)

def get_embedding(image_path):
    image = preprocess(Image.open(image_path).convert("RGB")) \
        .unsqueeze(0).to(device)

    with torch.no_grad():
        emb = model.encode_image(image)

    emb = emb / emb.norm(dim=-1, keepdim=True)
    return emb.cpu().numpy()[0]   # (512,)

def main():
    df = pd.read_csv(CSV_PATH)

    embeddings = []
    image_ids = []

    for _, row in df.iterrows():
        img_id = row["id"]
        img_path = BASE / img_id[0] / img_id[1] / img_id[2] / f"{img_id}.jpg"

        emb = get_embedding(img_path)
        embeddings.append(emb)
        image_ids.append(img_id)

    embeddings = np.array(embeddings)

    np.save(OUT_DIR / "clip_embeddings.npy", embeddings)
    pd.DataFrame({"id": image_ids}).to_csv(
        OUT_DIR / "image_ids.csv", index=False
    )

    print("✅ CLIP feature extraction complete")
    print("Embeddings shape:", embeddings.shape)

if __name__ == "__main__":
    main()
