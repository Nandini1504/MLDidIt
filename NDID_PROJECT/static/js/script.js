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
        imageFiles = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                imageFiles.push({ name: file.name, data: event.target.result });
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
    
    btn.disabled = true;
    btn.innerText = "AI is comparing vectors...";
    resultsArea.innerHTML = "<h4>Analysis in progress...</h4>";

    try {
        const response = await fetch('/api/find-duplicates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                images: imageFiles,
                threshold: document.getElementById('threshold').value
            })
        });

        const data = await response.json();
        
        resultsArea.innerHTML = `<h3>Found ${data.duplicates.length} Matches</h3>`;
        
        if (data.duplicates.length === 0) {
            resultsArea.innerHTML += "<p style='color: var(--success)'>✅ All images are unique!</p>";
        } else {
            data.duplicates.forEach(d => {
                const div = document.createElement('div');
                div.className = 'match-card';
                div.innerHTML = `⚠️ <b>Match:</b> ${d.pair[0]} & ${d.pair[1]} <br> Similarity: ${(d.score * 100).toFixed(2)}%`;
                resultsArea.appendChild(div);
            });
        }
    } catch (err) {
        resultsArea.innerHTML = "<p style='color:var(--danger)'>Error connecting to Flask server.</p>";
    } finally {
        btn.disabled = false;
        btn.innerText = "Run AI Analysis";
    }
}