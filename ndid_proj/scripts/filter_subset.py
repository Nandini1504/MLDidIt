from pathlib import Path
import pandas as pd

BASE = Path(__file__).parent
CSV = BASE / "subset1.csv"

# collect existing jpg ids
existing = set(p.stem for p in BASE.rglob("*.jpg"))

df = pd.read_csv(CSV)
col = "id" if "id" in df.columns else "image_id"

df = df[df[col].isin(existing)]

df.to_csv(BASE / "subset_available.csv", index=False)

print("✅ Images available:", len(df))
