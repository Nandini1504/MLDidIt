import pandas as pd
from pathlib import Path
from PIL import Image

BASE = Path(__file__).parent          # data/raw
CSV = BASE / "subset_500.csv"
OUT = BASE.parent / "processed"       # data/processed

OUT.mkdir(exist_ok=True)

df = pd.read_csv(CSV)
col = "id" if "id" in df.columns else "image_id"

processed = 0
missing = 0

for img_id in df[col]:
    img_path = BASE / img_id[0] / img_id[1] / img_id[2] / f"{img_id}.jpg"

    if not img_path.exists():
        missing += 1
        continue

    img = Image.open(img_path).convert("RGB").resize((224, 224))
    img.save(OUT / f"{img_id}.jpg")
    processed += 1

print("✅ IMAGES PROCESSED =", processed)
print("❌ IMAGES MISSING  =", missing)

