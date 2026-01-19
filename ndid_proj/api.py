from flask import Flask, request, jsonify
import base64
from PIL import Image
import io
app = Flask(__name__)
@app.route('/api/check-duplicate', methods=['POST'])
def check_duplicate():
    """Scenario 1: Check if a single image is a duplicate"""
    try:
        data = request.get_json()
        image_data = data.get('image')
        threshold = float(data.get('threshold', 0.85))
        metric = data.get('metric', 'cosine')
        
        if not image_data:
            return jsonify({"error": "Image is required"}), 400
        
        # Decode image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        image.save('temp_check.jpg')
        
        # Generate embedding
        embedding = embedder.get_embedding('temp_check.jpg')
        
        # TODO: Search in your vector database for similar images
        # For now, we'll return mock data
        # In production, you'd search your database of stored embeddings
        
        # Mock similar images (replace with actual database search)
        similar_images = [
            {
                "name": "image1.jpg",
                "similarity": 0.95,
                "image_path": "path/to/image1.jpg"  # Replace with actual path
            },
            {
                "name": "image2.jpg",
                "similarity": 0.87,
                "image_path": "path/to/image2.jpg"
            }
        ]
        
        # Check if any similarity exceeds threshold
        is_duplicate = any(img['similarity'] >= threshold for img in similar_images)
        
        return jsonify({
            "is_duplicate": is_duplicate,
            "similar_images": similar_images[:5],  # Top 5
            "threshold": threshold,
            "metric": metric
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/find-duplicates', methods=['POST'])
def find_duplicates():
    """Scenario 2: Find duplicates in bulk uploaded images"""
    try:
        data = request.get_json()
        images = data.get('images', [])
        threshold = float(data.get('threshold', 0.85))
        metric = data.get('metric', 'cosine')
        
        if len(images) < 2:
            return jsonify({"error": "At least 2 images required"}), 400
        
        # Generate embeddings for all images
        embeddings_dict = {}
        for idx, img in enumerate(images):
            image_bytes = base64.b64decode(img['data'].split(',')[1])
            image = Image.open(io.BytesIO(image_bytes))
            temp_path = f'temp_bulk_{idx}.jpg'
            image.save(temp_path)
            
            embedding = embedder.get_embedding(temp_path)
            embeddings_dict[img['name']] = embedding
        
        # Find duplicates
        from src.similarity import find_duplicates as find_dups
        duplicate_pairs = find_dups(embeddings_dict, threshold, metric)
        
        # Group duplicates
        duplicate_groups = []
        processed = set()
        
        for img1, img2, score in duplicate_pairs:
            if img1 in processed or img2 in processed:
                # Find existing group
                for group in duplicate_groups:
                    if img1 in group['images'] or img2 in group['images']:
                        if img1 not in group['images']:
                            group['images'].append(img1)
                        if img2 not in group['images']:
                            group['images'].append(img2)
                        processed.add(img1)
                        processed.add(img2)
                        break
            else:
                # Create new group
                duplicate_groups.append({
                    'images': [img1, img2],
                    'avg_similarity': score
                })
                processed.add(img1)
                processed.add(img2)
        
        unique_images = len(images) - len(processed)
        
        return jsonify({
            "total_images": len(images),
            "duplicate_groups": duplicate_groups,
            "unique_images": unique_images,
            "threshold": threshold,
            "metric": metric
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
