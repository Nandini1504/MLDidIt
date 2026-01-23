// Initialize threshold from your ML research
const OPTIMAL_THRESHOLD = 0.4126; 
document.getElementById('threshold').value = OPTIMAL_THRESHOLD;
document.getElementById('threshold-value').innerText = OPTIMAL_THRESHOLD;

// Global State
let currentMode = 'scenario1';
let singleImageBase64 = null; // Changed from file object to Base64 string

// --- UI HELPERS ---
function switchMode(mode) {
    currentMode = mode;
    // Toggle active classes for tabs
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${mode}`).classList.add('active');
    
    // Toggle visibility for sections
    document.getElementById('scenario1-content').style.display = mode === 'scenario1' ? 'block' : 'none';
    document.getElementById('scenario2-content').style.display = mode === 'scenario2' ? 'block' : 'none';
}

// Update threshold display on slider move
document.getElementById('threshold').addEventListener('input', (e) => {
    document.getElementById('threshold-value').innerText = e.target.value;
});

// --- SCENARIO 1: SINGLE IMAGE LOGIC ---
const singleInput = document.getElementById('image-single');

// Trigger file input when clicking the zone
document.getElementById('zone-single').onclick = () => singleInput.click();

singleInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ex) => {
            singleImageBase64 = ex.target.result; // Store the Base64 string
            document.getElementById('preview-single').innerHTML = `<img src="${singleImageBase64}" style="max-width:100%; border-radius:10px;">`;
            document.getElementById('preview-single').style.display = 'block';
            document.getElementById('zone-single').style.display = 'none';
            document.getElementById('checkDuplicateBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

async function checkDuplicate() {
    const threshold = document.getElementById('threshold').value;
    const metric = document.getElementById('metric').value;

    showLoading(true);

    try {
        const response = await fetch('/api/check-duplicate', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: singleImageBase64, // Sending as Base64 JSON
                threshold: threshold,
                metric: metric
            })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        displaySingleResults(data);
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        showLoading(false);
    }
}

// --- LOADING & RESULTS HELPERS ---
function showLoading(isVisible) {
    document.getElementById('loading').style.display = isVisible ? 'block' : 'none';
}

function displaySingleResults(data) {
    // Note: Make sure these IDs exist in your index.html
    const resultsSec = document.getElementById('results-scenario1');
    if(resultsSec) resultsSec.style.display = 'block';
    
    const statusText = document.getElementById('status-text-s1');
    const badge = document.getElementById('badge-icon-s1');
    
    if (data.is_duplicate) {
        statusText.innerText = "DUPLICATE DETECTED";
        statusText.style.color = "var(--danger)";
        badge.innerHTML = '<i class="fas fa-copy" style="color: var(--danger); font-size: 2rem;"></i>';
    } else {
        statusText.innerText = "UNIQUE IMAGE";
        statusText.style.color = "var(--success)";
        badge.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success); font-size: 2rem;"></i>';
    }
}