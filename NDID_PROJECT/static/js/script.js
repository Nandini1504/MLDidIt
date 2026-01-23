// Initialize threshold from your ML research
const OPTIMAL_THRESHOLD = 0.34; // Based on your 0.3442 result
document.getElementById('threshold').value = OPTIMAL_THRESHOLD;
document.getElementById('threshold-value').innerText = OPTIMAL_THRESHOLD;

// Global State
let currentMode = 'scenario1';
let selectedSingleFile = null;
let bulkFiles = [];

// --- UI HELPERS ---
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.scenario-content').forEach(c => c.classList.remove('active'));
    
    document.getElementById(`tab-${mode}`).classList.add('active');
    document.getElementById(`${mode}-content`).classList.add('active');
}

// Update threshold display on slider move
document.getElementById('threshold').addEventListener('input', (e) => {
    document.getElementById('threshold-value').innerText = e.target.value;
});

// --- SCENARIO 1: SINGLE IMAGE LOGIC ---
const singleInput = document.getElementById('image-single');
singleInput.addEventListener('change', (e) => {
    selectedSingleFile = e.target.files[0];
    if (selectedSingleFile) {
        const reader = new FileReader();
        reader.onload = (ex) => {
            document.getElementById('preview-single').innerHTML = `<img src="${ex.target.result}">`;
            document.getElementById('preview-single').style.display = 'block';
            document.getElementById('zone-single').style.display = 'none';
            document.getElementById('remove-single').style.display = 'block';
            document.getElementById('checkDuplicateBtn').disabled = false;
        };
        reader.readAsDataURL(selectedSingleFile);
    }
});

async function checkDuplicate() {
    const threshold = document.getElementById('threshold').value;
    const formData = new FormData();
    formData.append('image', selectedSingleFile);
    formData.append('threshold', threshold);

    showLoading(true);

    try {
        const response = await fetch('/detect-single', { method: 'POST', body: formData });
        const data = await response.json();
        displaySingleResults(data);
    } catch (err) {
        alert("Error connecting to Python backend!");
    } finally {
        showLoading(false);
    }
}

// --- LOADING HELPERS ---
function showLoading(isVisible) {
    document.getElementById('loading').style.display = isVisible ? 'block' : 'none';
    if(isVisible) {
        document.getElementById('results-scenario1').style.display = 'none';
        document.getElementById('results-scenario2').style.display = 'none';
    }
}

// Final Function to handle UI results
function displaySingleResults(data) {
    const resultsSec = document.getElementById('results-scenario1');
    resultsSec.style.display = 'block';
    
    const statusText = document.getElementById('status-text-s1');
    const badge = document.getElementById('badge-icon-s1');
    
    if (data.is_duplicate) {
        statusText.innerText = "DUPLICATE DETECTED";
        badge.innerHTML = '<i class="fas fa-copy" style="color: #ff3b30;"></i>';
    } else {
        statusText.innerText = "UNIQUE IMAGE";
        badge.innerHTML = '<i class="fas fa-check-circle" style="color: #34c759;"></i>';
    }
}