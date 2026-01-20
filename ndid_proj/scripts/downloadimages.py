import pandas as pd
import requests
from pathlib import Path
from tqdm import tqdm
import time

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "subset.csv"
IMG_DIR = BASE_DIR / "images"

IMG_DIR.mkdir(exist_ok=True)

df = pd.read_csv(CSV_PATH)

success = 0

for _, row in tqdm(df.iterrows(), total=len(df)):
    img_path = IMG_DIR / f"{row['id']}.jpg"

    if img_path.exists():
        continue

    try:
        r = requests.get(row["image_url"], timeout=5)
        if r.status_code == 200:
            with open(img_path, "wb") as f:
                f.write(r.content)
            success += 1
            time.sleep(0.1)
    except:
        continue

print("✅ Successfully downloaded images:", success)
print("📂 Saved to:", IMG_DIR)
