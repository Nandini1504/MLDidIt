const API_URL = 'http://localhost:5000';

// Global state
let currentMode = 'scenario1'; // 'scenario1' or 'scenario2'
let singleImageData = null;
let bulkImagesData = []; // Array of {name, data}
let startTime = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAPIHealth();
});

/* ================================================
   EVENT LISTENERS SETUP
================================================ */
function setupEventListeners() {
    // Threshold slider
    document.getElementById('threshold').addEventListener('input', (e) => {
        document.getElementById('threshold-value').textContent = e.target.value;
    });

    // SCENARIO 1: Single image upload
    document.getElementById('image-single').addEventListener('change', handleSingleImageUpload);
    setupDragAndDrop('zone-single', 'image-single', 'single');

    // SCENARIO 2: Bulk image upload
    document.getElementById('images-bulk').addEventListener('change', handleBulkImageUpload);
    setupDragAndDrop('zone-bulk', 'images-bulk', 'bulk');
}

/* ================================================
   MODE SWITCHING
================================================ */
function switchMode(mode) {
    currentMode = mode;
    
    // Update tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${mode}`).classList.add('active');
    
    // Update content visibility
    document.querySelectorAll('.scenario-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${mode}-content`).classList.add('active');
    
    // Hide results
    document.getElementById('results-scenario1').style.display = 'none';
    document.getElementById('results-scenario2').style.display = 'none';
    
    // Reset state
    if (mode === 'scenario1') {
        singleImageData = null;
        resetSingleImageUI();
    } else {
        bulkImagesData = [];
        resetBulkImageUI();
    }
}

/* ================================================
   DRAG & DROP SETUP
================================================ */
function setupDragAndDrop(zoneId, inputId, type) {
    const zone = document.getElementById(zoneId);
    
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = '#667eea';
        zone.style.background = 'linear-gradient(135deg, #f0f2ff 0%, #fff 100%)';
    });
    
    zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        zone.style.borderColor = '#ddd';
        zone.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #fff 100%)';
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.borderColor = '#ddd';
        zone.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #fff 100%)';
        
        const files = e.dataTransfer.files;
        const input = document.getElementById(inputId);
        
        if (type === 'single' && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                handleSingleImageUpload({ target: input });
            }
        } else if (type === 'bulk' && files.length > 0) {
            const dataTransfer = new DataTransfer();
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    dataTransfer.items.add(file);
                }
            });
            input.files = dataTransfer.files;
            handleBulkImageUpload({ target: input });
        }
    });
}

/* ================================================
   SCENARIO 1: SINGLE IMAGE FUNCTIONS
================================================ */
function handleSingleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
        alert('⚠️ Please upload a valid image file (PNG, JPG, JPEG)');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('⚠️ File size must be less than 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        singleImageData = e.target.result;
        
        // Update UI
        const preview = document.getElementById('preview-single');
        const zone = document.getElementById('zone-single');
        const removeBtn = document.getElementById('remove-single');
        
        preview.innerHTML = `<img src="${singleImageData}" alt="Uploaded Image">`;
        preview.style.display = 'block';
        zone.style.display = 'none';
        removeBtn.style.display = 'block';
        
        // Enable button
        document.getElementById('checkDuplicateBtn').disabled = false;
        
        // Animation
        preview.style.animation = 'scaleIn 0.5s ease';
    };
    
    reader.readAsDataURL(file);
}

function removeSingleImage() {
    singleImageData = null;
    resetSingleImageUI();
}

function resetSingleImageUI() {
    document.getElementById('image-single').value = '';
    document.getElementById('preview-single').innerHTML = '';
    document.getElementById('preview-single').style.display = 'none';
    document.getElementById('zone-single').style.display = 'flex';
    document.getElementById('remove-single').style.display = 'none';
    document.getElementById('checkDuplicateBtn').disabled = true;
}

async function checkDuplicate() {
    if (!singleImageData) {
        alert('⚠️ Please upload an image first!');
        return;
    }

    const threshold = parseFloat(document.getElementById('threshold').value);
    const metric = document.getElementById('metric').value;

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-scenario1').style.display = 'none';
    document.getElementById('loading').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    startTime = Date.now();

    try {
        const response = await fetch(`${API_URL}/api/check-duplicate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: singleImageData,
                threshold: threshold,
                metric: metric
            })
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const result = await response.json();
        if (result.error) throw new Error(result.error);

        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        setTimeout(() => {
            displayScenario1Results(result, processingTime);
        }, 500);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        
        let errorMessage = '❌ Error checking duplicate.\n\n';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Cannot connect to the API server.\n\n';
            errorMessage += '✅ Make sure the Flask API is running:\n';
            errorMessage += '   python api.py\n\n';
            errorMessage += '✅ Server should be at http://localhost:5000';
        } else {
            errorMessage += `Error: ${error.message}`;
        }
        alert(errorMessage);
    }
}

function displayScenario1Results(result, processingTime) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results-scenario1').style.display = 'block';
    
    // Status Badge
    const badgeIcon = document.getElementById('badge-icon-s1');
    const statusText = document.getElementById('status-text-s1');
    const statusBadge = document.getElementById('status-badge-s1');
    
    if (result.is_duplicate) {
        badgeIcon.innerHTML = '✅';
        badgeIcon.style.background = 'var(--danger-gradient)';
        statusText.textContent = 'DUPLICATE FOUND!';
        statusText.style.background = 'var(--danger-gradient)';
        statusBadge.style.borderColor = '#ef4444';
    } else {
        badgeIcon.innerHTML = '✅';
        badgeIcon.style.background = 'var(--success-gradient)';
        statusText.textContent = 'NO DUPLICATE FOUND';
        statusText.style.background = 'var(--success-gradient)';
        statusBadge.style.borderColor = '#22c55e';
    }
    
    statusText.style.webkitBackgroundClip = 'text';
    statusText.style.webkitTextFillColor = 'transparent';
    
    // Top-K Similar Images
    const similarGrid = document.getElementById('similar-images-grid');
    similarGrid.innerHTML = '';
    
    if (result.similar_images && result.similar_images.length > 0) {
        document.getElementById('similar-images-section').style.display = 'block';
        
        result.similar_images.forEach(img => {
            const card = document.createElement('div');
            card.className = 'similar-image-card';
            
            const scorePercent = (img.similarity * 100).toFixed(1);
            const badgeColor = img.similarity >= 0.9 ? '#ef4444' : 
                               img.similarity >= 0.8 ? '#eab308' : '#3b82f6';
            
            card.innerHTML = `
                <img src="${img.image_path}" alt="${img.name}">
                <div class="similar-image-info">
                    <div class="similarity-badge" style="background: ${badgeColor}; color: white;">
                        ${scorePercent}% Match
                    </div>
                    <div class="similar-image-name" title="${img.name}">${img.name}</div>
                </div>
            `;
            
            similarGrid.appendChild(card);
        });
    } else {
        document.getElementById('similar-images-section').style.display = 'none';
    }
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('results-scenario1').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/* ================================================
   SCENARIO 2: BULK UPLOAD FUNCTIONS
================================================ */
function handleBulkImageUpload(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
            console.warn(`Skipping ${file.name}: Not an image`);
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            console.warn(`Skipping ${file.name}: File too large`);
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) {
        alert('⚠️ No valid images found. Please select PNG, JPG, or JPEG files under 10MB.');
        return;
    }

    // Process files
    let processedCount = 0;
    
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            bulkImagesData.push({
                name: file.name,
                data: e.target.result
            });
            
            processedCount++;
            
            // Update UI after all files processed
            if (processedCount === validFiles.length) {
                updateBulkUploadUI();
            }
        };
        reader.readAsDataURL(file);
    });
}

function updateBulkUploadUI() {
    // Update count
    document.getElementById('upload-count').textContent = `${bulkImagesData.length} images selected`;
    
    // Show preview section
    document.getElementById('uploaded-preview-section').style.display = 'block';
    document.getElementById('image-count').textContent = bulkImagesData.length;
    
    // Populate preview grid
    const previewGrid = document.getElementById('bulk-preview-grid');
    previewGrid.innerHTML = '';
    
    bulkImagesData.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'bulk-preview-item';
        item.innerHTML = `
            <img src="${img.data}" alt="${img.name}">
            <div class="remove-icon" onclick="removeBulkImage(${index})">
                <i class="fas fa-times"></i>
            </div>
        `;
        previewGrid.appendChild(item);
    });
    
    // Enable find duplicates button
    document.getElementById('findDuplicatesBtn').disabled = bulkImagesData.length < 2;
}

function removeBulkImage(index) {
    bulkImagesData.splice(index, 1);
    
    if (bulkImagesData.length === 0) {
        resetBulkImageUI();
    } else {
        updateBulkUploadUI();
    }
}

function clearBulkImages() {
    bulkImagesData = [];
    resetBulkImageUI();
}

function resetBulkImageUI() {
    document.getElementById('images-bulk').value = '';
    document.getElementById('upload-count').textContent = '0 images selected';
    document.getElementById('uploaded-preview-section').style.display = 'none';
    document.getElementById('bulk-preview-grid').innerHTML = '';
    document.getElementById('findDuplicatesBtn').disabled = true;
}

async function findDuplicates() {
    if (bulkImagesData.length < 2) {
        alert('⚠️ Please upload at least 2 images!');
        return;
    }

    const threshold = parseFloat(document.getElementById('threshold').value);
    const metric = document.getElementById('metric').value;

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-scenario2').style.display = 'none';
    document.getElementById('loading').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    startTime = Date.now();

    try {
        const response = await fetch(`${API_URL}/api/find-duplicates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                images: bulkImagesData,
                threshold: threshold,
                metric: metric
            })
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const result = await response.json();
        if (result.error) throw new Error(result.error);

        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        setTimeout(() => {
            displayScenario2Results(result, processingTime);
        }, 500);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        
        let errorMessage = '❌ Error finding duplicates.\n\n';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Cannot connect to the API server.\n\n';
            errorMessage += '✅ Make sure the Flask API is running:\n';
            errorMessage += '   python api.py\n\n';
            errorMessage += '✅ Server should be at http://localhost:5000';
        } else {
            errorMessage += `Error: ${error.message}`;
        }
        alert(errorMessage);
    }
}

function displayScenario2Results(result, processingTime) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results-scenario2').style.display = 'block';
    
    // Update summary stats
    document.getElementById('stat-total').textContent = result.total_images || bulkImagesData.length;
    document.getElementById('stat-groups').textContent = result.duplicate_groups ? result.duplicate_groups.length : 0;
    document.getElementById('stat-unique').textContent = result.unique_images || 0;
    
    // Display duplicate groups
    const groupsContainer = document.getElementById('duplicate-groups');
    groupsContainer.innerHTML = '';
    
    if (result.duplicate_groups && result.duplicate_groups.length > 0) {
        document.getElementById('duplicate-groups-section').style.display = 'block';
        
        result.duplicate_groups.forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'duplicate-group';
            
            const groupImages = group.images.map(imgName => {
                const imgData = bulkImagesData.find(img => img.name === imgName);
                return imgData ? imgData.data : '';
            }).filter(Boolean);
            
            const imagesHTML = groupImages.map((imgData, imgIndex) => `
                <div class="group-image-item">
                    <img src="${imgData}" alt="Image ${imgIndex + 1}">
                    <div class="group-image-label">${group.images[imgIndex]}</div>
                </div>
            `).join('');
            
            groupDiv.innerHTML = `
                <div class="group-header">
                    <div class="group-title">
                        <i class="fas fa-layer-group"></i> Group ${index + 1}
                    </div>
                    <div class="group-count">${group.images.length} images</div>
                </div>
                <div class="group-images">
                    ${imagesHTML}
                </div>
            `;
            
            groupsContainer.appendChild(groupDiv);
        });
    } else {
        document.getElementById('duplicate-groups-section').style.display = 'block';
        groupsContainer.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #22c55e;">
                <i class="fas fa-check-circle" style="font-size: 4em; margin-bottom: 20px;"></i>
                <h3>No Duplicates Found!</h3>
                <p>All uploaded images are unique.</p>
            </div>
        `;
    }
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('results-scenario2').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/* ================================================
   API HEALTH CHECK
================================================ */
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_URL}/api/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API is healthy:', data);
            console.log(`📊 Model: ${data.model}`);
            console.log(`💻 Device: ${data.device}`);
        }
    } catch (error) {
        console.warn('⚠️ API is not running or not accessible');
        console.log('💡 Start the API with: python api.py');
        console.log('💡 Make sure it\'s running on http://localhost:5000');
    }
}

/* ================================================
   KEYBOARD SHORTCUTS
================================================ */
document.addEventListener('keydown', (e) => {
    // Press '1' to switch to Scenario 1
    if (e.key === '1') {
        switchMode('scenario1');
    }
    
    // Press '2' to switch to Scenario 2
    if (e.key === '2') {
        switchMode('scenario2');
    }
    
    // Press 'C' to check/find duplicates
    if (e.key === 'c' || e.key === 'C') {
        if (currentMode === 'scenario1') {
            const btn = document.getElementById('checkDuplicateBtn');
            if (!btn.disabled) checkDuplicate();
        } else {
            const btn = document.getElementById('findDuplicatesBtn');
            if (!btn.disabled) findDuplicates();
        }
    }
    
    // Press 'R' to reset
    if (e.key === 'r' || e.key === 'R') {
        if (currentMode === 'scenario1') {
            removeSingleImage();
        } else {
            clearBulkImages();
        }
    }
});

/* ================================================
   CONSOLE INITIALIZATION
================================================ */
console.log('%c🖼️ NDID - Near-Duplicate Image Detection', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cPowered by ResNet50 & Flask API', 'font-size: 12px; color: #999;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #667eea;');
console.log('Keyboard Shortcuts:');
console.log('  • Press "1" to switch to Scenario 1 (Single Image)');
console.log('  • Press "2" to switch to Scenario 2 (Bulk Upload)');
console.log('  • Press "C" to check/find duplicates');
console.log('  • Press "R" to reset current mode');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');