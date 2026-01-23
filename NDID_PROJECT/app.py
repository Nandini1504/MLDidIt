import os
import requests
from flask import Flask, request, jsonify, render_template
import torch
import numpy as np
from PIL import Image
# Import your model classes from model_utils.py
from model_utils import SiameseBackbone, SiameseHead 
def download_weights(file_path, url):
    if not os.path.exists(file_path):
        print(f"🚀 Weights not found at {file_path}. Downloading from cloud...")
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            with open(file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print("✅ Download complete!")
        except Exception as e:
            print(f"❌ Error downloading weights: {e}")
            # You might want to exit the script if weights are missing
            exit(1)
    else:
        print(f"⭐ Weights found at {file_path}. Ready to go!")

# --- CONFIGURATION ---
WEIGHTS_PATH = 'weights/slim_weights.pth'
# Replace this with your actual direct download link (Dropbox, GDrive direct, or HuggingFace)
DOWNLOAD_URL = 'https://your-cloud-link.com/slim_weights.pth'

# Run the downloader
download_weights(WEIGHTS_PATH, DOWNLOAD_URL)




app = Flask(__name__)

# --- Load Model & Threshold ---
BEST_THRESHOLD = 0.3442  # Your optimized value!
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

backbone = SiameseBackbone().to(device)
head = SiameseHead().to(device)

backbone.load_state_dict(torch.load('weights/backbone.pth', map_location=device))
head.load_state_dict(torch.load('weights/head.pth', map_location=device))
backbone.eval()
head.eval()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect-single', methods=['POST'])
def detect_single():
    # Logic to receive image, run backbone + head, 
    # and compare against your vector database
    pass

@app.route('/detect-bulk', methods=['POST'])
def detect_bulk():
    # Logic to cluster multiple images using BEST_THRESHOLD
    pass

if __name__ == '__main__':
    app.run(debug=True)