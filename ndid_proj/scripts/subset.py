import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TRAIN_CSV = BASE_DIR / "train.csv"
OUTPUT_CSV = BASE_DIR / "subset1.csv"

print("📂 Reading:", TRAIN_CSV)

df = pd.read_csv(TRAIN_CSV)

# keep only rows with image URLs
df = df[df["url"].notnull()]

# take first 5 images per landmark
df = df.groupby("landmark_id").head(5)

# keep only landmarks that actually have 5 images
df = df.groupby("landmark_id").filter(lambda x: len(x) == 5)

# limit to first 100 landmarks → 500 images
df = df.head(500).reset_index(drop=True)

df.to_csv(OUTPUT_CSV, index=False)

print("✅ subset1.csv created")
print("📊 Total images:", len(df))
print("🏷️ Total landmarks:", df['landmark_id'].nunique())
