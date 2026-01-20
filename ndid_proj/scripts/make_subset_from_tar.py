from pathlib import Path
import pandas as pd

BASE = Path(__file__).parent

# find all jpg images inside extracted tar folders
jpgs = list(BASE.rglob("*.jpg"))

print("Total images found:", len(jpgs))

# take first 500 only
jpgs = jpgs[:500]

rows = []
for p in jpgs:
    rows.append({
        "id": p.stem,
        "rel_path": str(p.relative_to(BASE))
    })

df = pd.DataFrame(rows)
df.to_csv(BASE / "subset_500.csv", index=False)

print("✅ subset_500.csv created")
print("Images in subset:", len(df))
