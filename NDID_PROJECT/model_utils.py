import os
import sys
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torch.nn.functional as F
import warnings

# Disable xFormers BEFORE any model loading
os.environ['XFORMERS_DISABLED'] = '1'
warnings.filterwarnings("ignore", message=".*xFormers.*")

# Block xFormers module from loading
sys.modules['xformers'] = None
sys.modules['xformers.ops'] = None


class SiameseBackbone(nn.Module):
    def __init__(self, model_name='dinov2_vits14'):
        super(SiameseBackbone, self).__init__()
        try:
            torch.hub.set_dir(os.path.expanduser('~/.cache/torch/hub'))
            print(f"Loading {model_name}...")
            
            # Load DINOv2 from repo
            self.backbone = torch.hub.load(
                'facebookresearch/dinov2:main', 
                model_name, 
                trust_repo=True,
                force_reload=False
            )
            
            # Set to eval mode
            self.backbone = self.backbone.eval()
            
            # Disable gradients for inference
            for param in self.backbone.parameters():
                param.requires_grad = False
            
            print("✓ Model loaded successfully")
            
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            import traceback
            traceback.print_exc()
            raise

    def forward(self, x):
        """
        Forward pass to extract embeddings from DINOv2 model
        Args:
            x: Input tensor of shape [batch_size, 3, 224, 224]
        Returns:
            Embeddings of shape [batch_size, feature_dim]
        """
        try:
            features = self.backbone.forward_features(x)
            
            # Handle dictionary output from DINOv2
            if isinstance(features, dict):
                # DINOv2 returns multiple keys, we want the normalized CLS token
                if 'x_norm_clstoken' in features:
                    # This is the normalized CLS token - perfect for embeddings
                    cls_token = features['x_norm_clstoken']
                    return cls_token
                elif 'x' in features:
                    # Fallback for other versions
                    cls_token = features['x'][:, 0]
                    return cls_token
                else:
                    raise KeyError(f"Expected 'x_norm_clstoken' or 'x' in features dict, got: {list(features.keys())}")
            
            # Handle tensor output directly
            elif isinstance(features, torch.Tensor):
                if features.dim() == 3:  # [batch, tokens, features]
                    return features[:, 0]  # Return CLS token
                else:
                    return features
            
            else:
                raise TypeError(f"Unexpected features type: {type(features)}")
                
        except Exception as e:
            print(f"Error in forward: {e}")
            import traceback
            traceback.print_exc()
            raise


def get_transform():
    """Get image transformation pipeline"""
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])


def calculate_similarity(emb1, emb2, metric='cosine'):
    """Calculate similarity between two embeddings"""
    if metric == 'cosine':
        return F.cosine_similarity(emb1, emb2).item()
    else:
        return torch.dist(emb1, emb2).item()