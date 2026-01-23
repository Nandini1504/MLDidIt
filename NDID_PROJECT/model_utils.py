import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
import torch.nn.functional as F

class SiameseBackbone(nn.Module):
    def __init__(self):
        super(SiameseBackbone, self).__init__()
        resnet = models.resnet50(pretrained=False)
        # Remove the last FC layer to get 2048-dim feature vectors
        self.backbone = nn.Sequential(*(list(resnet.children())[:-1]))

    def forward(self, x):
        x = self.backbone(x)
        return x.view(x.size(0), -1)

def get_transform():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

def calculate_similarity(emb1, emb2, metric='cosine'):
    if metric == 'cosine':
        return F.cosine_similarity(emb1, emb2).item()
    else:
        return torch.dist(emb1, emb2).item()