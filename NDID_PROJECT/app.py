import os
import torch
import gdown
from flask import Flask, render_template

app = Flask(__name__)

# --- CONFIGURATION ---
# 1. Paste the ID from your ReadMe link here
GOOGLE_DRIVE_ID = '1IaGdTjV3O5KklKeqAUtqFHUm99zNoV7I' 
WEIGHTS_PATH = 'weights/model_final.pth'

def download_weights():
    if not os.path.exists('weights'):
        os.makedirs('weights')
    
    # Check if file is missing OR empty (0 bytes)
    if not os.path.exists(WEIGHTS_PATH) or os.path.getsize(WEIGHTS_PATH) == 0:
        print("📥 Model file is empty or missing. Downloading weights...")
        url = f'https://drive.google.com/file/d/1IaGdTjV3O5KklKeqAUtqFHUm99zNoV7I/view'
        try:
            # This replaces the empty file with the real weights
            gdown.download(url, WEIGHTS_PATH, quiet=False)
        except Exception as e:
            print(f"❌ Download failed: {e}")

# Call this before the app starts
download_weights()

# --- LOAD MODEL ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# Import your model class from model_utils.py
from model_utils import SiameseBackbone 

model = SiameseBackbone().to(device)

try:
    # We load the weights into the architecture
    model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=device))
    model.eval()
    print("✅ AI Model initialized with weights successfully.")
except Exception as e:
    print(f"⚠️ Could not load weights: {e}. Check if the ID is correct.")

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)