import os
import io
import base64
import gdown
import torch
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from PIL import Image
from model_utils import SiameseBackbone, get_transform, calculate_similarity

app = Flask(__name__)
CORS(app)

# --- 1. DOWNLOADER CONFIG ---
WEIGHTS_FOLDER = 'weights'
WEIGHTS_PATH = os.path.join(WEIGHTS_FOLDER, 'model_final.pth')
GOOGLE_DRIVE_ID = '1IaGdTjV3O5KklKeqAUtqFHUm99zNoV7I' 

if not os.path.exists(WEIGHTS_PATH):
    os.makedirs(WEIGHTS_FOLDER, exist_ok=True)
    url = f'https://drive.google.com/file/d/1IaGdTjV3O5KklKeqAUtqFHUm99zNoV7I/view'
    gdown.download(url, WEIGHTS_PATH, quiet=False)

# --- 2. MODEL SETUP ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SiameseBackbone().to(device)
model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=device))
model.eval()
transform = get_transform()

def get_embedding(base64_str):
    image_data = base64.b64decode(base64_str.split(',')[1])
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = model(tensor)
    return embedding

# --- 3. ROUTES ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/check-duplicate', methods=['POST'])
def check_duplicate():
    try:
        data = request.json
        # Scenario 1 logic: Usually compares against a database. 
        # For this local demo, we just acknowledge receipt of the embedding.
        _ = get_embedding(data['image'])
        return jsonify({"is_duplicate": False, "similar_images": []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/find-duplicates', methods=['POST'])
def find_duplicates_route():
    try:
        data = request.json
        images = data['images']
        threshold = float(data.get('threshold', 0.4126))
        metric = data.get('metric', 'cosine')

        # Generate all embeddings
        embs = {img['name']: get_embedding(img['data']) for img in images}
        names = list(embs.keys())
        
        # Compare pairs
        duplicate_groups = []
        processed = set()

        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                n1, n2 = names[i], names[j]
                if n1 in processed and n2 in processed: continue
                
                score = calculate_similarity(embs[n1], embs[n2], metric)
                
                # Logic for Cosine (High score = Duplicate)
                if (metric == 'cosine' and score >= threshold):
                    duplicate_groups.append({"images": [n1, n2], "avg_similarity": score})
                    processed.update([n1, n2])

        return jsonify({
            "total_images": len(images),
            "duplicate_groups": duplicate_groups,
            "unique_images": len(images) - len(processed)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)