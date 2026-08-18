/**
 * AI-Based Smart Agriculture Platform - Main JavaScript Logic
 * -------------------------------------------------------------
 * Encapsulates form validation, simulated AI inference engines,
 * disease detection heuristics, irrigation logic, dynamic UI rendering,
 * and smart agricultural advisory generator.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // --- State Management ---
    const farmState = {
        soilMoisture: 42,
        soilTemp: 26,
        soilPh: 6.5,
        humidity: 60,
        airTemp: 28,
        rainfall: 120,
        nitrogen: 90,
        phosphorus: 42,
        potassium: 43,
        cropType: 'Wheat',
        farmArea: 5.0,
        isDataCollected: true
    };

    // Simulated Leaf Disease Dataset
    const diseaseDataset = [
        {
            name: 'Healthy Leaf',
            confidence: 98.4,
            severity: 'None',
            severityClass: 'badge-success',
            treatment: 'No disease detected. Continue normal agronomic practices and nutrient scheduling.'
        },
        {
            name: 'Tomato Early Blight',
            confidence: 94.2,
            severity: 'Medium',
            severityClass: 'badge-warning',
            treatment: 'Apply copper-based fungicides. Remove infected lower leaves to prevent spore dispersion.'
        },
        {
            name: 'Tomato Late Blight',
            confidence: 91.8,
            severity: 'High',
            severityClass: 'badge-danger',
            treatment: 'Urgent: Apply systemic bio-fungicide immediately. Improve aeration and cut down overhead watering.'
        },
        {
            name: 'Powdery Mildew',
            confidence: 96.5,
            severity: 'Medium',
            severityClass: 'badge-warning',
            treatment: 'Spray potassium bicarbonate or neem-oil solution. Ensure adequate sunlight exposure.'
        },
        {
            name: 'Bacterial Spot',
            confidence: 89.7,
            severity: 'High',
            severityClass: 'badge-danger',
            treatment: 'Apply streptomycin or copper bactericide. Avoid handling plants when foliage is wet.'
        }
    ];

    // --- DOM Elements ---
    const farmDataForm = document.getElementById('farmDataForm');
    const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const collectedDataDisplay = document.getElementById('collectedDataDisplay');
    const lastUpdatedTag = document.getElementById('lastUpdatedTag');
    
    // Buttons
    const runAiAnalysisBtn = document.getElementById('runAiAnalysisBtn');
    const detectDiseaseBtn = document.getElementById('detectDiseaseBtn');
    const checkIrrigationBtn = document.getElementById('checkIrrigationBtn');
    const updateWeatherBtn = document.getElementById('updateWeatherBtn');
    const generateCropRecBtn = document.getElementById('generateCropRecBtn');
    
    // File Input / Preview
    const leafImageInput = document.getElementById('leafImageInput');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const previewContainer = document.getElementById('previewContainer');
    const leafPreview = document.getElementById('leafPreview');
    const removeImgBtn = document.getElementById('removeImgBtn');
    const diseaseOutput = document.getElementById('diseaseOutput');

    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Toast Notification System
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toastNotification');
        const toastMessage = document.getElementById('toastMessage');
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // --- 1. Form Handling & Data Collection ---
    function populateFormWithState() {
        document.getElementById('soilMoisture').value = farmState.soilMoisture;
        document.getElementById('soilTemp').value = farmState.soilTemp;
        document.getElementById('soilPh').value = farmState.soilPh;
        document.getElementById('humidity').value = farmState.humidity;
        document.getElementById('airTemp').value = farmState.airTemp;
        document.getElementById('rainfall').value = farmState.rainfall;
        document.getElementById('nitrogen').value = farmState.nitrogen;
        document.getElementById('phosphorus').value = farmState.phosphorus;
        document.getElementById('potassium').value = farmState.potassium;
        document.getElementById('cropType').value = farmState.cropType;
        document.getElementById('farmArea').value = farmState.farmArea;
    }

    function renderCollectedDataSnapshot() {
        if (!farmState.isDataCollected) {
            collectedDataDisplay.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="database" class="empty-icon"></i>
                    <p>No field data saved yet.</p>
                </div>`;
            if (window.lucide) lucide.createIcons();
            return;
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastUpdatedTag.textContent = `Updated at ${now}`;
        lastUpdatedTag.className = 'badge badge-success';

        collectedDataDisplay.className = '';
        collectedDataDisplay.innerHTML = `
            <div class="grid-2">
                <div class="metric-row"><span>Moisture</span> <strong>${farmState.soilMoisture}%</strong></div>
                <div class="metric-row"><span>pH Balance</span> <strong>${farmState.soilPh}</strong></div>
                <div class="metric-row"><span>Soil Temp</span> <strong>${farmState.soilTemp} °C</strong></div>
                <div class="metric-row"><span>Air Humidity</span> <strong>${farmState.humidity}%</strong></div>
                <div class="metric-row"><span>Air Temp</span> <strong>${farmState.airTemp} °C</strong></div>
                <div class="metric-row"><span>Rainfall</span> <strong>${farmState.rainfall} mm</strong></div>
                <div class="metric-row"><span>Nitrogen (N)</span> <strong>${farmState.nitrogen} mg/kg</strong></div>
                <div class="metric-row"><span>Phosphorus (P)</span> <strong>${farmState.phosphorus} mg/kg</strong></div>
                <div class="metric-row"><span>Potassium (K)</span> <strong>${farmState.potassium} mg/kg</strong></div>
                <div class="metric-row"><span>Current Crop</span> <strong>${farmState.cropType}</strong></div>
            </div>
            <div class="mt-3 p-2 bg-light text-center" style="border-radius: 8px;">
                <small class="text-muted">Coverage Area: <strong>${farmState.farmArea} Acres</strong></small>
            </div>
        `;
    }

    farmDataForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Inputs Validation & Extraction
        farmState.soilMoisture = parseFloat(document.getElementById('soilMoisture').value);
        farmState.soilTemp = parseFloat(document.getElementById('soilTemp').value);
        farmState.soilPh = parseFloat(document.getElementById('soilPh').value);
        farmState.humidity = parseFloat(document.getElementById('humidity').value);
        farmState.airTemp = parseFloat(document.getElementById('airTemp').value);
        farmState.rainfall = parseFloat(document.getElementById('rainfall').value);
        farmState.nitrogen = parseFloat(document.getElementById('nitrogen').value);
        farmState.phosphorus = parseFloat(document.getElementById('phosphorus').value);
        farmState.potassium = parseFloat(document.getElementById('potassium').value);
        farmState.cropType = document.getElementById('cropType').value;
        farmState.farmArea = parseFloat(document.getElementById('farmArea').value);
        farmState.isDataCollected = true;

        renderCollectedDataSnapshot();
        updateDashboardViews();
        generateInsights();
        showToast('Farm parameters collected & saved to local state!');
    });

    loadSampleDataBtn.addEventListener('click', () => {
        // Inject randomized but realistic sensor values
        farmState.soilMoisture = Math.floor(Math.random() * 40) + 30; // 30-70%
        farmState.soilTemp = Math.floor(Math.random() * 10) + 22;     // 22-32 C
        farmState.soilPh = parseFloat((Math.random() * 2 + 5.8).toFixed(1)); // 5.8 - 7.8
        farmState.humidity = Math.floor(Math.random() * 35) + 45;    // 45-80%
        farmState.airTemp = farmState.soilTemp + 2;
        farmState.rainfall = Math.floor(Math.random() * 150) + 50;
        farmState.nitrogen = Math.floor(Math.random() * 60) + 60;
        farmState.phosphorus = Math.floor(Math.random() * 30) + 30;
        farmState.potassium = Math.floor(Math.random() * 30) + 30;
        farmState.farmArea = 5.0;
        farmState.isDataCollected = true;

        populateFormWithState();
        renderCollectedDataSnapshot();
        updateDashboardViews();
        generateInsights();
        showToast('Sample sensor telemetry injected successfully.');
    });

    resetFormBtn.addEventListener('click', () => {
        farmDataForm.reset();
        farmState.isDataCollected = false;
        renderCollectedDataSnapshot();
        showToast('Form inputs cleared.');
    });

    // --- 2. Dashboard Dynamic Updates ---
    function updateDashboardViews() {
        document.getElementById('dashMoisture').textContent = `${farmState.soilMoisture}%`;
        document.getElementById('dashMoistureBar').style.width = `${farmState.soilMoisture}%`;
        
        document.getElementById('dashPh').textContent = farmState.soilPh;
        document.getElementById('dashPhBar').style.width = `${(farmState.soilPh / 14) * 100}%`;
        
        document.getElementById('dashTemp').textContent = `${farmState.airTemp} °C`;
        document.getElementById('dashTempBar').style.width = `${(farmState.airTemp / 50) * 100}%`;
        
        document.getElementById('dashHumidity').textContent = `${farmState.humidity}%`;
        document.getElementById('dashHumidityBar').style.width = `${farmState.humidity}%`;

        // Update Irrigation & Sensor readouts elsewhere
        document.getElementById('irriMoisture').textContent = `${farmState.soilMoisture}%`;
        document.getElementById('irriTemp').textContent = `${farmState.airTemp} °C`;
        document.getElementById('irriHumidity').textContent = `${farmState.humidity}%`;
    }

    // --- 3. AI Analysis Simulation Engine ---
    runAiAnalysisBtn.addEventListener('click', () => {
        if (!farmState.isDataCollected) {
            showToast('Please submit farm data first!');
            return;
        }

        runAiAnalysisBtn.disabled = true;
        runAiAnalysisBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Computing ML Models...`;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            // Heuristic logic for soil state
            let soilStatus = 'Good';
            let soilDesc = 'Soil pH and physical parameters match target agronomic thresholds.';
            
            if (farmState.soilPh < 6.0 || farmState.soilPh > 7.5) {
                soilStatus = 'Moderate';
                soilDesc = 'Sub-optimal pH detected. Consider liming or organic mulching.';
            }
            if (farmState.soilMoisture < 25 || farmState.soilMoisture > 80) {
                soilStatus = 'Poor';
                soilDesc = 'Extreme moisture stress detected. High root hypoxia or wilting risk.';
            }

            // NPK Logic
            let nutrientStatus = 'Balanced';
            let nutrientDesc = 'Macro-nutrients (N-P-K) are present in adequate concentrations.';
            if (farmState.nitrogen < 70) {
                nutrientStatus = 'Deficient (N)';
                nutrientDesc = 'Low Nitrogen detected. Leaf chlorosis may occur without urea application.';
            } else if (farmState.phosphorus < 30) {
                nutrientStatus = 'Deficient (P)';
                nutrientDesc = 'Low Phosphorus detected. Root elongation and bloom count may suffer.';
            }

            // Priority Action
            let actionStatus = 'Maintain Routine';
            let actionDesc = 'No urgent intervention required. Continue scheduled monitoring.';
            
            if (farmState.soilMoisture < 30) {
                actionStatus = 'Schedule Irrigation';
                actionDesc = 'Soil moisture below crop depletion point. Initiate drip cycle.';
            } else if (farmState.nitrogen < 70) {
                actionStatus = 'Apply Nitrogen';
                actionDesc = 'Top-dress with nitrogenous fertilizer within 48 hours.';
            }

            document.getElementById('aiSoilStatus').textContent = soilStatus;
            document.getElementById('aiSoilDesc').textContent = soilDesc;

            document.getElementById('aiNutrientStatus').textContent = nutrientStatus;
            document.getElementById('aiNutrientDesc').textContent = nutrientDesc;

            document.getElementById('aiActionStatus').textContent = actionStatus;
            document.getElementById('aiActionDesc').textContent = actionDesc;

            runAiAnalysisBtn.disabled = false;
            runAiAnalysisBtn.innerHTML = `<i data-lucide="cpu"></i> Run AI Diagnostics`;
            if (window.lucide) lucide.createIcons();

            showToast('AI analysis completed successfully.');
        }, 1000);
    });

    // --- 4. Disease Detection Engine ---
    leafImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                leafPreview.src = evt.target.result;
                uploadPlaceholder.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                detectDiseaseBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    removeImgBtn.addEventListener('click', () => {
        leafImageInput.value = '';
        leafPreview.src = '';
        previewContainer.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        detectDiseaseBtn.disabled = true;
        diseaseOutput.innerHTML = `
            <div class="empty-state">
                <i data-lucide="scan" class="empty-icon"></i>
                <p>Upload an image and click "Scan & Detect Disease" to show diagnostic results.</p>
            </div>`;
        if (window.lucide) lucide.createIcons();
    });

    detectDiseaseBtn.addEventListener('click', () => {
        detectDiseaseBtn.disabled = true;
        detectDiseaseBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Running Vision Model...`;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            // Pick a deterministic or random result from sample dataset
            const selectedResult = diseaseDataset[Math.floor(Math.random() * diseaseDataset.length)];

            diseaseOutput.innerHTML = `
                <div class="disease-result-card">
                    <div class="card-header" style="margin-bottom: 0.5rem;">
                        <h4 style="font-size: 1.2rem; font-weight: 800;">${selectedResult.name}</h4>
                        <span class="badge ${selectedResult.severityClass}">Severity: ${selectedResult.severity}</span>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted">Detection Confidence</small>
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" style="width: ${selectedResult.confidence}%; background: var(--primary);"></div>
                        </div>
                        <strong style="font-size: 0.85rem;" class="text-accent">${selectedResult.confidence}% Confidence</strong>
                    </div>
                    <div class="p-3 bg-light" style="border-radius: 8px; border-left: 3px solid var(--primary);">
                        <strong>Suggested Action:</strong>
                        <p class="text-muted" style="font-size: 0.9rem; margin-top: 0.25rem;">${selectedResult.treatment}</p>
                    </div>
                </div>
            `;

            document.getElementById('diseaseModelTag').textContent = 'Inference Complete';
            document.getElementById('diseaseModelTag').className = 'badge badge-success';

            detectDiseaseBtn.disabled = false;
            detectDiseaseBtn.innerHTML = `<i data-lucide="search-code"></i> Scan & Detect Disease`;
            if (window.lucide) lucide.createIcons();

            showToast(`Disease Diagnosis: ${selectedResult.name}`);
        }, 1200);
    });

    // --- 5. Smart Irrigation Rules Engine ---
    checkIrrigationBtn.addEventListener('click', () => {
        const moisture = farmState.soilMoisture;
        const rainChance = parseInt(document.getElementById('irriRainProb').textContent);
        
        const badge = document.getElementById('irrigationBadge');
        const text = document.getElementById('irrigationResultText');
        const reason = document.getElementById('irrigationReason');
        const waterIcon = document.getElementById('waterIcon');
        const ripples = document.getElementById('waterRipples');

        let decision = '';
        let explanation = '';
        let badgeStyle = 'badge-neutral';

        if (moisture < 35 && rainChance < 40) {
            decision = 'Urgent Irrigation Required';
            explanation = `Soil moisture is depleted (${moisture}%) and rain chance is low (${rainChance}%). Water immediately.`;
            badgeStyle = 'badge-danger';
            ripples.classList.add('active');
            waterIcon.style.color = '#ef4444';
        } else if (moisture < 50 && rainChance < 60) {
            decision = 'Irrigation Recommended';
            explanation = `Soil moisture is moderate (${moisture}%). Apply light drip irrigation before noon.`;
            badgeStyle = 'badge-warning';
            ripples.classList.add('active');
            waterIcon.style.color = '#0284c7';
        } else {
            decision = 'Irrigation Not Required';
            explanation = `Soil moisture level (${moisture}%) is adequate or high rain chance (${rainChance}%) will preserve moisture.`;
            badgeStyle = 'badge-success';
            ripples.classList.remove('active');
            waterIcon.style.color = '#22c55e';
        }

        badge.textContent = decision;
        badge.className = `badge ${badgeStyle}`;
        text.textContent = decision;
        reason.textContent = explanation;

        // Also sync dashboard
        document.getElementById('dashIrrigation').textContent = decision.includes('Not Required') ? 'Standby' : 'Active Needed';
        document.getElementById('dashIrrigationBadge').textContent = decision;
        document.getElementById('dashIrrigationBadge').className = `badge ${badgeStyle}`;

        showToast(`Irrigation Assessment: ${decision}`);
    });

    // --- 6. Weather Forecast Engine ---
    const sampleForecasts = [
        { day: 'Mon', temp: '28° / 19°', icon: 'sun', condition: 'Sunny' },
        { day: 'Tue', temp: '27° / 20°', icon: 'cloud-sun', condition: 'Partly Cloudy' },
        { day: 'Wed', temp: '24° / 18°', icon: 'cloud-rain', condition: 'Light Rain' },
        { day: 'Thu', temp: '26° / 19°', icon: 'cloud', condition: 'Overcast' },
        { day: 'Fri', temp: '29° / 21°', icon: 'sun', condition: 'Clear Sky' }
    ];

    function renderWeatherForecast() {
        const grid = document.getElementById('forecastGrid');
        if (!grid) return;

        grid.innerHTML = sampleForecasts.map(f => `
            <div class="forecast-day">
                <span class="day-name">${f.day}</span>
                <div><i data-lucide="${f.icon}" class="f-icon"></i></div>
                <span class="temp-range">${f.temp}</span>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    updateWeatherBtn.addEventListener('click', () => {
        updateWeatherBtn.disabled = true;
        updateWeatherBtn.innerHTML = `<i data-lucide="refresh-cw" class="spin"></i> Syncing Satellite...`;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            const newTemp = Math.floor(Math.random() * 8) + 24; // 24 - 32 C
            const newHumidity = Math.floor(Math.random() * 30) + 50;
            const newRain = Math.floor(Math.random() * 50) + 10;

            document.getElementById('weatherTemp').textContent = `${newTemp} °C`;
            document.getElementById('weatherHumidity').textContent = `${newHumidity}%`;
            document.getElementById('weatherRain').textContent = `${newRain}%`;
            document.getElementById('irriRainProb').textContent = `${newRain}%`;

            updateWeatherBtn.disabled = false;
            updateWeatherBtn.innerHTML = `<i data-lucide="refresh-cw"></i> Update Weather Data`;
            if (window.lucide) lucide.createIcons();

            showToast('Weather telemetry updated from API simulation.');
        }, 800);
    });

    // --- 7. Crop Recommendation Logic ---
    const cropDatabase = [
        { name: 'Wheat', minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 200, icon: 'wheat' },
        { name: 'Rice', minPh: 5.0, maxPh: 6.5, minRain: 150, maxRain: 500, icon: 'sprout' },
        { name: 'Maize', minPh: 5.8, maxPh: 7.0, minRain: 80, maxRain: 250, icon: 'wheat' },
        { name: 'Cotton', minPh: 6.0, maxPh: 8.0, minRain: 60, maxRain: 180, icon: 'flower-2' },
        { name: 'Tomato', minPh: 6.0, maxPh: 6.8, minRain: 40, maxRain: 120, icon: 'apple' },
        { name: 'Soybean', minPh: 6.0, maxPh: 7.0, minRain: 70, maxRain: 220, icon: 'leaf' }
    ];

    function calculateCropSuitability() {
        const grid = document.getElementById('cropRecGrid');
        if (!grid) return;

        const ph = farmState.soilPh;
        const rain = farmState.rainfall;

        const results = cropDatabase.map(crop => {
            let score = 100;
            
            // Deduct based on pH variance
            if (ph < crop.minPh || ph > crop.maxPh) {
                score -= 25;
            }
            // Deduct based on rainfall variance
            if (rain < crop.minRain || rain > crop.maxRain) {
                score -= 20;
            }

            // Ensure valid bounds
            score = Math.max(45, Math.min(98, score + Math.floor(Math.random() * 6)));

            let reason = `Compatible with pH ${ph} and regional precipitation patterns.`;
            if (score > 85) {
                reason = `High suitability! Optimal pH (${crop.minPh}-${crop.maxPh}) and ideal rainfall match.`;
            } else if (score < 70) {
                reason = `Sub-optimal pH or rainfall. Requires soil conditioning for best yield.`;
            }

            return { ...crop, score, reason };
        });

        // Sort descending by score
        results.sort((a, b) => b.score - a.score);

        grid.innerHTML = results.slice(0, 3).map(crop => `
            <div class="crop-card">
                <div>
                    <div class="crop-card-header">
                        <span class="crop-name">${crop.name}</span>
                        <span class="crop-score">${crop.score}% Match</span>
                    </div>
                    <div class="crop-meta">
                        <span>Target pH: ${crop.minPh} - ${crop.maxPh}</span> | 
                        <span>Rainfall: ${crop.minRain}-${crop.maxRain}mm</span>
                    </div>
                </div>
                <div class="crop-reason">
                    <p>${crop.reason}</p>
                </div>
            </div>
        `).join('');

        // Update dashboard highlight
        const topCrop = results[0];
        document.getElementById('dashRecommendedCrop').textContent = topCrop.name;
        document.getElementById('dashCropMatchBadge').textContent = `${topCrop.score}% Match`;

        if (window.lucide) lucide.createIcons();
    }

    generateCropRecBtn.addEventListener('click', () => {
        calculateCropSuitability();
        showToast('Calculated crop suitability scores based on current field parameters.');
    });

    // --- 8. AI Dynamic Insights Engine ---
    function generateInsights() {
        const insightsList = document.getElementById('insightsList');
        if (!insightsList) return;

        const insights = [];

        if (farmState.soilMoisture < 35) {
            insights.push({
                type: 'warning',
                title: 'Soil Moisture Deficit',
                desc: 'Soil moisture is below 35%. Root stress detected. Consider scheduling irrigation soon.'
            });
        } else {
            insights.push({
                type: 'success',
                title: 'Moisture Level Stable',
                desc: 'Soil moisture is optimal for nutrient uptake and root respiration.'
            });
        }

        if (farmState.nitrogen < 75) {
            insights.push({
                type: 'warning',
                title: 'Low Nitrogen Concentration',
                desc: 'Nitrogen levels are below recommended standards. Foliar spray or organic compost suggested.'
            });
        }

        if (farmState.rainfall > 200) {
            insights.push({
                type: 'info',
                title: 'High Rainfall Expected',
                desc: 'Abundant rain detected. Irrigation pumps can remain offline to save energy.'
            });
        }

        insights.push({
            type: 'info',
            title: `Crop Alignment (${farmState.cropType})`,
            desc: `Current soil pH of ${farmState.soilPh} is being evaluated against expected yield metrics.`
        });

        insightsList.innerHTML = insights.map(item => `
            <div class="insight-item ${item.type}">
                <i data-lucide="${item.type === 'warning' ? 'alert-triangle' : item.type === 'success' ? 'check-circle' : 'info'}" class="insight-icon"></i>
                <div class="insight-content">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    // --- Initial Boot Sequence ---
    populateFormWithState();
    renderCollectedDataSnapshot();
    updateDashboardViews();
    renderWeatherForecast();
    calculateCropSuitability();
    generateInsights();
});