import os
import sys
import torch
import gdown
from flask import Flask, render_template, request, jsonify
from PIL import Image
import io
from torchvision import transforms

app = Flask(__name__, template_folder='templates', static_folder='static')

# --- CONFIGURATION ---
GOOGLE_DRIVE_ID = '1IaGdTjV3O5KklKeqAUtqFHUm99zNoV7I' 
WEIGHTS_PATH = 'weights/model_final.pth'

# --- IMAGE PREPROCESSING TRANSFORM ---
TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225])
])

def download_weights():
    """Download model weights from Google Drive if missing"""
    if not os.path.exists('weights'):
        os.makedirs('weights')
    
    # Check if file is missing OR empty (0 bytes)
    if not os.path.exists(WEIGHTS_PATH) or os.path.getsize(WEIGHTS_PATH) == 0:
        print("📥 Model file is empty or missing. Downloading weights...")
        url = f'https://drive.google.com/uc?id={GOOGLE_DRIVE_ID}'
        try:
            gdown.download(url, WEIGHTS_PATH, quiet=False)
            print("✅ Weights downloaded successfully!")
        except Exception as e:
            print(f"❌ Download failed: {e}")

# Call this before the app starts
download_weights()

# --- LOAD MODEL ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️ Using device: {device}")

# Import model ONLY ONCE - with proper error handling
model = None
# ...existing code...

try:
    from model_utils import SiameseBackbone
    model = SiameseBackbone().to(device)
    
    # Load the weights into the architecture
    if os.path.exists(WEIGHTS_PATH):
        model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=device, weights_only=False))
        model.eval()
        print("✅ AI Model initialized with weights successfully.")
    else:
        model.eval()
        print("⚠️ Model loaded but weights file not found.")
except ImportError as e:
    print(f"❌ ERROR: Could not import SiameseBackbone")
    print(f"   Make sure 'model_utils.py' exists in: {os.getcwd()}")
    print(f"   Details: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error loading model: {e}")
    sys.exit(1)

# ...existing code...

def preprocess_image(image_file):
    """Convert image file to normalized tensor"""
    try:
        img = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        img_tensor = TRANSFORM(img).unsqueeze(0)
        return img_tensor
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")

@app.route('/')
def home():
    """Serve the main HTML page"""
    try:
        return render_template('index.html')
    except Exception as e:
        return f"❌ templates/index.html not found<br>Error: {e}", 404

@app.route('/api/find-duplicates', methods=['POST'])
def find_duplicates():
    """Handle image duplicate detection via Siamese network"""
    try:
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({'error': 'Two images required'}), 400
        
        image1 = request.files['image1']
        image2 = request.files['image2']
        
        if image1.filename == '' or image2.filename == '':
            return jsonify({'error': 'Both images must have filenames'}), 400
        
        img1_tensor = preprocess_image(image1)
        img2_tensor = preprocess_image(image2)
        
        img1_tensor = img1_tensor.to(device)
        img2_tensor = img2_tensor.to(device)
        
        with torch.no_grad():
            embedding1 = model(img1_tensor)
            embedding2 = model(img2_tensor)
        
        similarity = torch.nn.functional.cosine_similarity(embedding1, embedding2)
        similarity_score = similarity.item()
        
        threshold = 0.7
        is_duplicate = similarity_score > threshold
        
        return jsonify({
            'isDuplicate': is_duplicate,
            'similarity': round(float(similarity_score), 4),
            'threshold': threshold,
            'message': 'Images are duplicates!' if is_duplicate else 'Images are different.'
        })
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n🚀 Starting Flask server on http://0.0.0.0:{port}\n")
    app.run(debug=True, host='0.0.0.0', port=port)