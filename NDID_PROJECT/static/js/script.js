// Global State & Optimal Threshold
const OPTIMAL_THRESHOLD = 0.3442;
let singleImageBase64 = null;
let bulkImages = []; // Stores {name, data}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initial Sync
    document.getElementById('threshold').value = OPTIMAL_THRESHOLD;
    document.getElementById('threshold-value').innerText = OPTIMAL_THRESHOLD;
    
    // --- TAB SWITCHING ---
    document.getElementById('tab-scenario1').addEventListener('click', function() {
        switchMode('scenario1');
    });
    
    document.getElementById('tab-scenario2').addEventListener('click', function() {
        switchMode('scenario2');
    });
    
    // --- UPLOAD ZONE CLICKS ---
    const zoneSingle = document.getElementById('zone-single');
    const imageSingle = document.getElementById('image-single');
    
    zoneSingle.addEventListener('click', function() {
        imageSingle.click();
    });
    
    // Drag and drop for single
    zoneSingle.addEventListener('dragover', function(e) {
        e.preventDefault();
        zoneSingle.style.borderColor = 'var(--primary)';
    });
    
    zoneSingle.addEventListener('dragleave', function(e) {
        e.preventDefault();
        zoneSingle.style.borderColor = '#334155';
    });
    
    zoneSingle.addEventListener('drop', function(e) {
        e.preventDefault();
        zoneSingle.style.borderColor = '#334155';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageSingle.files = files;
            handleSingleUpload(files[0]);
        }
    });
    
    const zoneBulk = document.getElementById('zone-bulk');
    const imagesBulk = document.getElementById('images-bulk');
    
    zoneBulk.addEventListener('click', function() {
        imagesBulk.click();
    });
    
    // --- SINGLE UPLOAD HANDLER ---
    imageSingle.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleSingleUpload(e.target.files[0]);
        }
    });
    
    function handleSingleUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(ex) {
            singleImageBase64 = ex.target.result;
            const preview = document.getElementById('preview-single');
            preview.innerHTML = `<img src="${singleImageBase64}" alt="Uploaded image">`;
            preview.style.display = 'block';
            document.getElementById('zone-single').style.display = 'none';
            document.getElementById('remove-single').style.display = 'block';
            document.getElementById('checkDuplicateBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    // Remove single image
    document.getElementById('remove-single').addEventListener('click', function() {
        resetSingle();
    });
    
    // Check duplicate button
    document.getElementById('checkDuplicateBtn').addEventListener('click', function() {
        checkDuplicate();
    });
    
    // --- BULK UPLOAD HANDLER ---
    imagesBulk.addEventListener('change', function(e) {
        handleBulkUpload(e.target.files);
    });
    
    function handleBulkUpload(files) {
        const filesArray = Array.from(files);
        const grid = document.getElementById('bulk-preview-grid');
        grid.innerHTML = '';
        bulkImages = [];
        
        if (filesArray.length === 0) return;
        
        document.getElementById('upload-count').innerText = `Loading ${filesArray.length} images...`;
        
        let loadedCount = 0;
        filesArray.forEach(file => {
            if (!file.type.startsWith('image/')) {
                loadedCount++;
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(ex) {
                bulkImages.push({ name: file.name, data: ex.target.result });
                const img = document.createElement('img');
                img.src = ex.target.result;
                img.alt = file.name;
                grid.appendChild(img);
                
                loadedCount++;
                if (loadedCount === filesArray.length) {
                    document.getElementById('upload-count').innerText = `${bulkImages.length} images selected`;
                    document.getElementById('findDuplicatesBtn').disabled = bulkImages.length < 2;
                }
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Find duplicates button
    document.getElementById('findDuplicatesBtn').addEventListener('click', function() {
        findBulkDuplicates();
    });
    
    // --- SLIDER UPDATE ---
    document.getElementById('threshold').addEventListener('input', function() {
        document.getElementById('threshold-value').innerText = this.value;
    });
});

// --- MODE SWITCHING FUNCTION ---
function switchMode(mode) {
    document.querySelectorAll('.scenario-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`${mode}-content`).classList.add('active');
    document.getElementById(`tab-${mode}`).classList.add('active');
}

// --- RESET SINGLE ---
function resetSingle() {
    singleImageBase64 = null;
    document.getElementById('preview-single').style.display = 'none';
    document.getElementById('zone-single').style.display = 'block';
    document.getElementById('remove-single').style.display = 'none';
    document.getElementById('checkDuplicateBtn').disabled = true;
    document.getElementById('results-scenario1').style.display = 'none';
    document.getElementById('image-single').value = '';
}

// --- API CALL: CHECK DUPLICATE ---
async function checkDuplicate() {
    toggleLoading(true);
    try {
        const response = await fetch('/api/check-duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: singleImageBase64,
                threshold: parseFloat(document.getElementById('threshold').value),
                metric: document.getElementById('metric').value
            })
        });
        
        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }
        
        const data = await response.json();
        renderSingleResults(data);
    } catch (err) { 
        console.error('Error:', err);
        alert("Error connecting to server: " + err.message); 
    }
    toggleLoading(false);
}

// --- API CALL: FIND BULK DUPLICATES ---
async function findBulkDuplicates() {
    toggleLoading(true);
    try {
        const response = await fetch('/api/find-duplicates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                images: bulkImages,
                threshold: parseFloat(document.getElementById('threshold').value),
                metric: document.getElementById('metric').value
            })
        });
        
        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }
        
        const data = await response.json();
        renderBulkResults(data);
    } catch (err) { 
        console.error('Error:', err);
        alert("Error connecting to server: " + err.message); 
    }
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
    document.getElementById('stat-total').innerText = data.total_images || 0;
    document.getElementById('stat-groups').innerText = data.duplicate_groups ? data.duplicate_groups.length : 0;
    document.getElementById('stat-unique').innerText = data.unique_images || 0;

    const list = document.getElementById('duplicate-groups');
    if (data.duplicate_groups && data.duplicate_groups.length > 0) {
        list.innerHTML = data.duplicate_groups.map(g => `
            <div>
                <p>📁 Group: ${g.images.join(' & ')}</p>
                <small>Similarity: ${(g.avg_similarity * 100).toFixed(2)}%</small>
            </div>
        `).join('');
    } else {
        list.innerHTML = '<p style="color: var(--success);">No duplicates found!</p>';
    }
}