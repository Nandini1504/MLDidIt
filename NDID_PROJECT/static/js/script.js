// Global State & Optimal Threshold
const OPTIMAL_THRESHOLD = 0.3442;
let singleImageBase64 = null;
let bulkImages = []; // Stores {name, data}

// Initial Sync
document.getElementById('threshold').value = OPTIMAL_THRESHOLD;
document.getElementById('threshold-value').innerText = OPTIMAL_THRESHOLD;

// --- CLICK TRIGGERS ---
document.getElementById('zone-single').onclick = () => document.getElementById('image-single').click();
document.getElementById('zone-bulk').onclick = () => document.getElementById('images-bulk').click();

// --- SCENARIO SWITCHING ---
function switchMode(mode) {
    document.querySelectorAll('.scenario-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`${mode}-content`).style.display = 'block';
    document.getElementById(`tab-${mode}`).classList.add('active');
}

// --- SINGLE UPLOAD LOGIC ---
document.getElementById('image-single').onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ex) => {
            singleImageBase64 = ex.target.result;
            const preview = document.getElementById('preview-single');
            preview.innerHTML = `<img src="${singleImageBase64}">`;
            preview.style.display = 'block';
            document.getElementById('zone-single').style.display = 'none';
            document.getElementById('remove-single').style.display = 'block';
            document.getElementById('checkDuplicateBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
};

function resetSingle() {
    singleImageBase64 = null;
    document.getElementById('preview-single').style.display = 'none';
    document.getElementById('zone-single').style.display = 'block';
    document.getElementById('remove-single').style.display = 'none';
    document.getElementById('checkDuplicateBtn').disabled = true;
    document.getElementById('results-scenario1').style.display = 'none';
    document.getElementById('image-single').value = '';
}

async function checkDuplicate() {
    toggleLoading(true);
    try {
        const response = await fetch('/api/check-duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: singleImageBase64,
                threshold: document.getElementById('threshold').value,
                metric: document.getElementById('metric').value
            })
        });
        const data = await response.json();
        renderSingleResults(data);
    } catch (err) { alert("Error connecting to server"); }
    toggleLoading(false);
}

// --- BULK UPLOAD LOGIC ---
document.getElementById('images-bulk').onchange = function(e) {
    const files = Array.from(e.target.files);
    const grid = document.getElementById('bulk-preview-grid');
    grid.innerHTML = '';
    bulkImages = [];

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ex) => {
            bulkImages.push({ name: file.name, data: ex.target.result });
            grid.innerHTML += `<img src="${ex.target.result}">`;
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('upload-count').innerText = `${files.length} images selected`;
    document.getElementById('findDuplicatesBtn').disabled = files.length < 2;
};

async function findBulkDuplicates() {
    toggleLoading(true);
    try {
        const response = await fetch('/api/find-duplicates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                images: bulkImages,
                threshold: document.getElementById('threshold').value,
                metric: document.getElementById('metric').value
            })
        });
        const data = await response.json();
        renderBulkResults(data);
    } catch (err) { alert("Error connecting to server"); }
    toggleLoading(false);
}

// --- UI UPDATERS ---
function toggleLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function renderSingleResults(data) {
    const res = document.getElementById('results-scenario1');
    const txt = document.getElementById('status-text-s1');
    const icon = document.getElementById('badge-icon-s1');
    res.style.display = 'block';
    
    if (data.is_duplicate) {
        txt.innerText = "DUPLICATE DETECTED";
        txt.style.color = "var(--danger)";
        icon.innerHTML = '<i class="fas fa-copy fa-3x" style="color: var(--danger)"></i>';
    } else {
        txt.innerText = "UNIQUE IMAGE";
        txt.style.color = "var(--success)";
        icon.innerHTML = '<i class="fas fa-check-circle fa-3x" style="color: var(--success)"></i>';
    }
}

function renderBulkResults(data) {
    const res = document.getElementById('results-scenario2');
    res.style.display = 'block';
    document.getElementById('stat-total').innerText = data.total_images;
    document.getElementById('stat-groups').innerText = data.duplicate_groups.length;
    document.getElementById('stat-unique').innerText = data.unique_images;

    const list = document.getElementById('duplicate-groups');
    list.innerHTML = data.duplicate_groups.map(g => `
        <div style="border-bottom: 1px solid #334155; padding: 10px;">
            <p>📁 Group: ${g.images.join(' & ')}</p>
            <small>Similarity: ${(g.avg_similarity * 100).toFixed(2)}%</small>
        </div>
    `).join('');
}

// Slider Display Sync
document.getElementById('threshold').oninput = function() {
    document.getElementById('threshold-value').innerText = this.value;
};