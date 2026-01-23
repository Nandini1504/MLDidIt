from flask import Flask, request, jsonify, render_template
import torch
import numpy as np
from PIL import Image
# Import your model classes from model_utils.py
from model_utils import SiameseBackbone, SiameseHead 

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