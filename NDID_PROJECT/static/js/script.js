let imageFiles = [];

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const thresholdInput = document.getElementById('threshold');
    const thresholdVal = document.getElementById('threshold-val');

    thresholdInput.oninput = () => thresholdVal.innerText = thresholdInput.value;

    fileInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        const grid = document.getElementById('preview-grid');
        grid.innerHTML = '';
        imageFiles = files;  // Store actual file objects, not data URLs

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                grid.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('analyze-btn').disabled = files.length < 2;
    };
});

async function runAnalysis() {
    const btn = document.getElementById('analyze-btn');
    const resultsArea = document.getElementById('results');
    
    if (imageFiles.length < 2) {
        resultsArea.innerHTML = "<p style='color:var(--danger)'>❌ Please select at least 2 images</p>";
        return;
    }
    
    btn.disabled = true;
    btn.innerText = "AI is comparing vectors...";
    resultsArea.innerHTML = "<h4>Analysis in progress...</h4>";

    try {
        // Process all pairs of images
        const formData = new FormData();
        formData.append('image1', imageFiles[0]);
        formData.append('image2', imageFiles[1]);
        formData.append('threshold', document.getElementById('threshold').value);

        const response = await fetch('/api/find-duplicates', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            resultsArea.innerHTML = `<p style='color:var(--danger)'>❌ ${data.error}</p>`;
            return;
        }
        
        resultsArea.innerHTML = `
            <div class="match-card">
                <h3>🔍 Comparison Result</h3>
                <p><b>Image 1:</b> ${imageFiles[0].name}</p>
                <p><b>Image 2:</b> ${imageFiles[1].name}</p>
                <p><b>Similarity Score:</b> ${(data.similarity * 100).toFixed(2)}%</p>
                <p><b>Threshold:</b> ${(data.threshold * 100).toFixed(2)}%</p>
                <p style='color: ${data.isDuplicate ? 'var(--danger)' : 'var(--success)'}'>
                    ${data.isDuplicate ? '⚠️ DUPLICATE' : '✅ UNIQUE'}
                </p>
                <p><i>${data.message}</i></p>
            </div>
        `;
    } catch (err) {
        console.error('Error:', err);
        resultsArea.innerHTML = `<p style='color:var(--danger)'>❌ Error: ${err.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "Run AI Analysis";
    }
}