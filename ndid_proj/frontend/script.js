* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    --danger-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    --card-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    --hover-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0f0f23;
    color: #333;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
}

/* Animated Background */
.bg-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

.shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: float 20s infinite ease-in-out;
}

.shape-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -100px;
    left: -100px;
    animation-delay: 0s;
}

.shape-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: -100px;
    right: -100px;
    animation-delay: 5s;
}

.shape-3 {
    width: 350px;
    height: 350px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 10s;
}

@keyframes float {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(50px, -50px) scale(1.1);
    }
    66% {
        transform: translate(-30px, 30px) scale(0.9);
    }
}

/* Container */
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
    position: relative;
    z-index: 1;
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 50px;
    animation: fadeInDown 0.8s ease;
}

.logo {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 2em;
    font-weight: 800;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 15px;
}

.logo i {
    font-size: 1.2em;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: pulse 2s infinite;
}

.main-title {
    font-size: 4em;
    font-weight: 1000;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 15px;
    letter-spacing: -2px;
}

.subtitle {
    font-size: 2.7em;
    color: #999;
    font-weight: 300;
}


.control-panel {
    margin-bottom: 40px;
    animation: fadeInUp 0.8s ease 0.2s both;
}

.control-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 30px;
    box-shadow: var(--card-shadow);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.control-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.3em;
    font-weight: 700;
    color: #333;
    margin-bottom: 25px;
}

.control-header i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.control-body {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 30px;
}

.control-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #555;
    margin-bottom: 12px;
}

.slider-container {
    display: flex;
    align-items: center;
    gap: 15px;
}

input[type="range"] {
    flex: 1;
    height: 8px;
    border-radius: 10px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    outline: none;
    -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border: none;
    transition: transform 0.2s;
}

input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.2);
}

.slider-value {
    min-width: 60px;
    text-align: center;
    font-size: 1.3em;
    font-weight: 700;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.threshold-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 0.85em;
    color: #999;
}

.metric-select {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1em;
    font-weight: 600;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
}

.metric-select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Upload Section */
.upload-section {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 30px;
    margin-bottom: 40px;
    animation: fadeInUp 0.8s ease 0.4s both;
}

.upload-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 25px;
    box-shadow: var(--card-shadow);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
}

.upload-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--hover-shadow);
}

.upload-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2em;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
}

.upload-header i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.image-container {
    position: relative;
    height: 400px;
}

.upload-zone {
    width: 100%;
    height: 100%;
    border: 3px dashed #ddd;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
}

.upload-zone:hover {
    border-color: #667eea;
    background: linear-gradient(135deg, #f0f2ff 0%, #fff 100%);
    transform: scale(1.02);
}

.upload-icon {
    font-size: 4em;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.upload-text {
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.upload-hint {
    color: #999;
    font-size: 0.9em;
}

.image-preview {
    display: none;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-btn {
    display: none;
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 59, 48, 0.9);
    color: white;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
}

.remove-btn:hover {
    transform: scale(1.1) rotate(90deg);
    background: rgba(255, 59, 48, 1);
}

.vs-divider {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vs-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--primary-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    font-weight: 900;
    color: white;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* Compare Button */
.compare-btn {
    width: 100%;
    padding: 25px;
    border: none;
    border-radius: 16px;
    background: var(--primary-gradient);
    color: white;
    font-size: 1.5em;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    animation: fadeInUp 0.8s ease 0.6s both;
}

.compare-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.compare-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.compare-btn i {
    font-size: 1.2em;
}

/* Loading */
.loading-container {
    display: none;
    text-align: center;
    padding: 60px 20px;
    animation: fadeIn 0.5s ease;
}

.loading-spinner {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 30px;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid transparent;
    animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
    border-top-color: #667eea;
    animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
    border-right-color: #764ba2;
    animation-delay: 0.3s;
}

.spinner-ring:nth-child(3) {
    border-bottom-color: #f093fb;
    animation-delay: 0.6s;
}

@keyframes spin {
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 1.5em;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
}

.loading-subtext {
    color: #999;
    font-size: 1em;
}

/* Results Section */
.results-section {
    display: none;
    animation: fadeInUp 0.8s ease;
}

.results-header {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
    margin-bottom: 40px;
}

.results-header i {
    font-size: 2em;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.results-header h2 {
    font-size: 2.5em;
    font-weight: 800;
    color: #fff;
}

.main-result-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 50px;
    margin-bottom: 30px;
    box-shadow: var(--card-shadow);
    text-align: center;
}

.result-status {
    margin-bottom: 40px;
}

.status-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

#statusText {
    font-size: 2.5em;
    font-weight: 900;
    margin-bottom: 10px;
}

.similarity-gauge {
    position: relative;
    max-width: 300px;
    margin: 0 auto;
}

.gauge-svg {
    width: 100%;
    height: auto;
}

.gauge-bg {
    fill: none;
    stroke: #e0e0e0;
    stroke-width: 20;
    stroke-linecap: round;
}

.gauge-fill {
    fill: none;
    stroke: url(#gaugeGradient);
    stroke-width: 20;
    stroke-linecap: round;
    transition: stroke-dasharray 1s ease;
}

.gauge-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3em;
    font-weight: 900;
    color: #333;
}

.gauge-percent {
    font-size: 0.5em;
    color: #999;
}

.gauge-label {
    text-align: center;
    margin-top: 10px;
    font-weight: 600;
    color: #666;
}

/* Metrics Grid */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.metric-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 25px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: var(--card-shadow);
    transition: all 0.3s;
    animation: fadeInUp 0.5s ease both;
}

.metric-card:nth-child(1) { animation-delay: 0.1s; }
.metric-card:nth-child(2) { animation-delay: 0.2s; }
.metric-card:nth-child(3) { animation-delay: 0.3s; }
.metric-card:nth-child(4) { animation-delay: 0.4s; }

.metric-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--hover-shadow);
}

.metric-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5em;
    flex-shrink: 0;
}

.metric-info {
    flex: 1;
}

.metric-info h4 {
    font-size: 0.85em;
    color: #999;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.metric-info p {
    font-size: 1.3em;
    font-weight: 700;
    color: #333;
}

/* Interpretation Panel */
.interpretation-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: var(--card-shadow);
}

.interpretation-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.interpretation-header i {
    font-size: 1.5em;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.interpretation-header h3 {
    font-size: 1.5em;
    font-weight: 700;
    color: #333;
}

.interpretation-content {
    font-size: 1.1em;
    line-height: 1.8;
    color: #555;
}

/* Details Panel */
.details-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    margin-bottom: 50px;
}

.details-toggle {
    width: 100%;
    padding: 20px 30px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.2em;
    font-weight: 700;
    color: #333;
    cursor: pointer;
    transition: all 0.3s;
}

.details-toggle:hover {
    background: rgba(102, 126, 234, 0.05);
}

.details-toggle i:first-child {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.toggle-icon {
    margin-left: auto;
    transition: transform 0.3s;
}

.details-toggle.active .toggle-icon {
    transform: rotate(180deg);
}

.details-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding: 0 30px;
}

.details-content.active {
    max-height: 500px;
    padding: 20px 30px 30px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-label {
    font-weight: 600;
    color: #666;
}

.detail-value {
    font-weight: 700;
    color: #333;
}

/* Info Section */
.info-section {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 50px;
    margin-bottom: 50px;
    box-shadow: var(--card-shadow);
}

.info-section h3 {
    font-size: 2em;
    font-weight: 800;
    color: #333;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.info-section h3 i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.info-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    margin-bottom: 50px;
}

.info-step {
    text-align: center;
    padding: 30px;
    border-radius: 16px;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
    transition: all 0.3s;
}

.info-step:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.step-number {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: var(--primary-gradient);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8em;
    font-weight: 900;
}

.info-step h4 {
    font-size: 1.2em;
    color: #333;
    margin-bottom: 10px;
}

.info-step p {
    color: #666;
    line-height: 1.6;
}

.use-cases {
    margin-top: 50px;
}

.use-case-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
}

.use-case-item {
    text-align: center;
    padding: 30px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
}

.use-case-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.use-case-item i {
    font-size: 2.5em;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 15px;
    display: block;
}

.use-case-item h4 {
    font-size: 1.1em;
    color: #333;
    margin-bottom: 10px;
}

.use-case-item p {
    color: #666;
    font-size: 0.95em;
}

/* Footer */
.footer {
    text-align: center;
    padding: 40px 20px;
    color: #999;
}

.footer p {
    margin-bottom: 10px;
}

.footer strong {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 15px;
}

.footer-links a {
    color: #999;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
}

.footer-links a:hover {
    color: #667eea;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 1200px) {
    .metrics-grid,
    .info-steps,
    .use-case-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .main-title {
        font-size: 2.5em;
    }
    
    .upload-section {
        grid-template-columns: 1fr;
    }
    
    .vs-divider {
        transform: rotate(90deg);
        margin: 20px 0;
    }
    
    .control-body {
        grid-template-columns: 1fr;
    }
    
    .metrics-grid,
    .info-steps,
    .use-case-grid {
        grid-template-columns: 1fr;
    }
    
    .image-container {
        height: 300px;
    }
    
    .info-section {
        padding: 30px 20px;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 2em;
    }
    
    .subtitle {
        font-size: 1em;
    }
    
    .compare-btn {
        font-size: 1.2em;
        padding: 20px;
    }
}
/* ============================================ */
/* MODE SELECTION */
/* ============================================ */
.mode-selection {
    margin-bottom: 40px;
    animation: fadeInUp 0.8s ease 0.1s both;
}

.mode-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.mode-tab {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 3px solid transparent;
    border-radius: 20px;
    padding: 30px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 20px;
    text-align: left;
}

.mode-tab i {
    font-size: 3em;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.mode-tab h3 {
    font-size: 1.3em;
    color: #333;
    margin-bottom: 8px;
}

.mode-tab p {
    font-size: 0.95em;
    color: #666;
}

.mode-tab:hover {
    transform: translateY(-5px);
    box-shadow: var(--hover-shadow);
}

.mode-tab.active {
    border-color: #667eea;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

/* ============================================ */
/* SCENARIO CONTENT */
/* ============================================ */
.scenario-content {
    display: none;
}

.scenario-content.active {
    display: block;
    animation: fadeInUp 0.8s ease;
}

.scenario-description {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: var(--card-shadow);
}

.scenario-description h2 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.scenario-description h2 i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.scenario-description ol {
    margin-left: 20px;
}

.scenario-description li {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 12px;
    line-height: 1.6;
}

/* ============================================ */
/* SINGLE UPLOAD (SCENARIO 1) */
/* ============================================ */
.single-upload-section {
    margin-bottom: 40px;
    animation: fadeInUp 0.8s ease 0.4s both;
}

.upload-card.single {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 30px;
    box-shadow: var(--card-shadow);
    max-width: 700px;
    margin: 0 auto;
}

/* ============================================ */
/* BULK UPLOAD (SCENARIO 2) */
/* ============================================ */
.bulk-upload-section {
    margin-bottom: 40px;
    animation: fadeInUp 0.8s ease 0.4s both;
}

.upload-card.bulk {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 30px;
    box-shadow: var(--card-shadow);
}

.bulk-upload-zone {
    width: 100%;
    min-height: 300px;
    border: 3px dashed #ddd;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
    padding: 40px;
}

.bulk-upload-zone:hover {
    border-color: #667eea;
    background: linear-gradient(135deg, #f0f2ff 0%, #fff 100%);
    transform: scale(1.01);
}

.upload-count {
    margin-top: 20px;
    font-size: 1.3em;
    font-weight: 700;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Uploaded Preview Section */
.uploaded-preview-section {
    margin-top: 30px;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.preview-header h3 {
    font-size: 1.5em;
    color: #333;
    display: flex;
    align-items: center;
    gap: 12px;
}

.preview-header h3 i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.btn-clear {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    background: var(--danger-gradient);
    color: white;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
}

.btn-clear:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(250, 112, 154, 0.4);
}

.bulk-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
}

.bulk-preview-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.bulk-preview-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.bulk-preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.bulk-preview-item .remove-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 59, 48, 0.9);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
}

.bulk-preview-item .remove-icon:hover {
    transform: scale(1.1) rotate(90deg);
    background: rgba(255, 59, 48, 1);
}

/* ============================================ */
/* RESULTS STYLING */
/* ============================================ */
.duplicate-status-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 50px;
    margin-bottom: 30px;
    box-shadow: var(--card-shadow);
    text-align: center;
}

.status-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.badge-icon {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4em;
    margin-bottom: 20px;
    animation: scaleIn 0.5s ease;
}

#status-text-s1 {
    font-size: 2.5em;
    font-weight: 900;
}

/* Similar Images Section */
.similar-images-section {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: var(--card-shadow);
}

.similar-images-section h3 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.similar-images-section h3 i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.similar-images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.similar-image-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.similar-image-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.similar-image-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.similar-image-info {
    padding: 15px;
}

.similarity-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1.1em;
    margin-bottom: 8px;
}

.similar-image-name {
    font-size: 0.9em;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Summary Stats */
.summary-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 30px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: var(--card-shadow);
    transition: all 0.3s;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--hover-shadow);
}

.stat-icon {
    width: 70px;
    height: 70px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2em;
}

.stat-info h4 {
    font-size: 0.9em;
    color: #999;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.stat-info p {
    font-size: 2.5em;
    font-weight: 900;
    color: #333;
}

/* Duplicate Groups */
.duplicate-groups-section {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: var(--card-shadow);
}

.duplicate-groups-section h3 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.duplicate-groups-section h3 i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.duplicate-group {
    background: white;
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
}

.group-title {
    font-size: 1.3em;
    font-weight: 700;
    color: #333;
}

.group-count {
    padding: 8px 16px;
    border-radius: 20px;
    background: var(--primary-gradient);
    color: white;
    font-weight: 600;
}

.group-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
}

.group-image-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.group-image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.group-image-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.85em;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
    .mode-tabs {
        grid-template-columns: 1fr;
    }
    
    .summary-stats {
        grid-template-columns: 1fr;
    }
}