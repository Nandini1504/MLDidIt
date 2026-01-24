import os
import sys

# Disable xFormers BEFORE importing torch
os.environ['XFORMERS_DISABLED'] = '1'

# Block xFormers module loading entirely
sys.modules['xformers'] = None
sys.modules['xformers.ops'] = None

import torch
from flask import Flask, render_template, request, jsonify
from PIL import Image
import io
from torchvision import transforms

app = Flask(__name__, template_folder='templates', static_folder='static')

# --- IMAGE PREPROCESSING TRANSFORM ---
TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225])
])

# --- LOAD MODEL ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️ Using device: {device}")
print(f"🔧 xFormers disabled: {os.environ.get('XFORMERS_DISABLED', 'NOT SET')}")

model = None

try:
    from model_utils import SiameseBackbone
    print("⏳ Loading DINOv2 model (this may take a minute on first run)...")
    model = SiameseBackbone().to(device)
    model.eval()
    print("✅ AI Model initialized successfully with DINOv2.")
except ImportError as e:
    print(f"❌ ERROR: Could not import SiameseBackbone")
    print(f"   Make sure 'model_utils.py' exists in: {os.getcwd()}")
    print(f"   Details: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error loading model: {e}")
    sys.exit(1)

def preprocess_image(image_file):
    """Convert image file to normalized tensor"""
    try:
        print(f"      [preprocess] Reading file: {image_file.filename}")
        image_data = image_file.read()
        print(f"      [preprocess] File size: {len(image_data)} bytes")
        
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        print(f"      [preprocess] Image mode: {img.mode}, Size: {img.size}")
        
        img_tensor = TRANSFORM(img).unsqueeze(0)
        print(f"      [preprocess] Tensor shape: {img_tensor.shape}")
        return img_tensor
    except Exception as e:
        print(f"      [preprocess] Error: {e}")
        import traceback
        traceback.print_exc()
        raise ValueError(f"Image processing failed: {str(e)}")

@app.route('/')
def home():
    """Serve the main HTML page"""
    try:
        return render_template('index.html')
    except Exception as e:
        return f"❌ templates/index.html not found<br>Error: {e}", 404

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model': 'loaded' if model is not None else 'not loaded',
        'device': str(device)
    })

@app.route('/api/find-duplicates', methods=['POST'])
def find_duplicates():
    """Handle image duplicate detection via DINOv2 embeddings"""
    try:
        print("🔍 Received request to /api/find-duplicates")
        print(f"   Files in request: {list(request.files.keys())}")
        
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({'error': 'Two images required'}), 400
        
        image1 = request.files['image1']
        image2 = request.files['image2']
        
        if image1.filename == '' or image2.filename == '':
            return jsonify({'error': 'Both images must have filenames'}), 400
        
        print(f"   Processing: {image1.filename} vs {image2.filename}")
        
        # Reset file pointers to beginning
        image1.seek(0)
        image2.seek(0)
        
        try:
            img1_tensor = preprocess_image(image1)
            image1.seek(0)  # Reset for any potential second read
            img2_tensor = preprocess_image(image2)
            print(f"   ✅ Images preprocessed")
        except Exception as e:
            print(f"   ❌ Preprocessing error: {e}")
            raise
        
        print(f"   Tensor shapes - img1: {img1_tensor.shape}, img2: {img2_tensor.shape}")
        
        img1_tensor = img1_tensor.to(device)
        img2_tensor = img2_tensor.to(device)
        
        print("   Running model inference...")
        try:
            with torch.no_grad():
                print(f"      Calling model.forward() for image1...")
                embedding1 = model(img1_tensor)
                print(f"      ✅ Image1 embedding computed: {embedding1.shape}")
                
                print(f"      Calling model.forward() for image2...")
                embedding2 = model(img2_tensor)
                print(f"      ✅ Image2 embedding computed: {embedding2.shape}")
        except Exception as e:
            print(f"   ❌ Model inference error: {e}")
            import traceback
            traceback.print_exc()
            raise
        
        print(f"   Embedding shapes - emb1: {embedding1.shape}, emb2: {embedding2.shape}")
        
        # Squeeze batch dimension to get [feature_dim]
        try:
            embedding1 = embedding1.squeeze(0)  
            embedding2 = embedding2.squeeze(0)
            print(f"   ✅ Squeezed embedding shapes - emb1: {embedding1.shape}, emb2: {embedding2.shape}")
        except Exception as e:
            print(f"   ❌ Squeeze error: {e}")
            raise
        
        # Calculate cosine similarity with properly shaped tensors
        try:
            similarity = torch.nn.functional.cosine_similarity(embedding1.unsqueeze(0), embedding2.unsqueeze(0))
            similarity_score = similarity.item()
            print(f"   ✅ Similarity computed: {similarity_score:.4f}")
        except Exception as e:
            print(f"   ❌ Cosine similarity error: {e}")
            import traceback
            traceback.print_exc()
            raise
        
        # Get threshold from request or use default
        try:
            threshold = float(request.form.get('threshold', 0.7))
            is_duplicate = similarity_score > threshold
            print(f"   ✅ Threshold: {threshold}, Duplicate: {is_duplicate}")
        except Exception as e:
            print(f"   ❌ Threshold/duplicate check error: {e}")
            raise
        
        return jsonify({
            'isDuplicate': is_duplicate,
            'similarity': round(float(similarity_score), 4),
            'threshold': threshold,
            'message': 'Images are duplicates!' if is_duplicate else 'Images are different.'
        })
    
    except ValueError as e:
        print(f"❌ ValueError: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"❌ Exception in /api/find-duplicates: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n🚀 Starting Flask server on http://0.0.0.0:{port}\n")
    app.run(debug=True, host='0.0.0.0', port=port)