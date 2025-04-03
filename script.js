// Reusable function to validate weight input
function validateWeightInput(tabId) {
    const weightInput = document.getElementById(`weight-${tabId}`);
    const weight = parseFloat(weightInput.value);

    if (isNaN(weight) || weight <= 0) {
        alert("Please enter a valid weight 🏋️‍♂️");
        weightInput.focus();
        return false;
    }

    return weight;
}

// Main calculator functions
function calculateProtein() {
    // Add celebration animation
    document.querySelector('.calculator').classList.add('protein-party');
    
    // Get values
    const weight = validateWeightInput("standard");
    if (!weight) return;
    const unit = document.querySelector('input[name="unit"]:checked').id;
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = parseFloat(document.getElementById('goal').value);
    const resultDiv = document.querySelector('.result');

    // Convert units
    const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;

    // Calculate protein
    const protein = Math.round(weightKg * activity * goal);
    
    // Calculate range (±10%)
    const minProtein = Math.round(protein * 0.9);
    const maxProtein = Math.round(protein * 1.1);
    
    // Show range
    document.getElementById('minProtein').textContent = `${minProtein}g`;
    document.getElementById('maxProtein').textContent = `${maxProtein}g`;
    document.getElementById('proteinRange').classList.remove('d-none');

    // Create animated emojis
    const emojis = ['🍗', '🥚', '🥛', '🥩', '🍤', '🥜'];
    const animatedEmojis = emojis.map(e => 
        `<span class="protein-emoji" style="animation-delay: ${Math.random()*1}s">${e}</span>`
    ).join('');

    // Show results
    document.getElementById('proteinResult').innerHTML = `
        <span class="muscle-emoji">💪</span>
        <strong class="display-4">${protein}g/day</strong>
        <span class="muscle-emoji">💪</span><br>
        <small class="text-muted mt-2 d-block">
            ${animatedEmojis}<br>
            Calculation: ${weightKg.toFixed(1)}kg × ${activity} × ${goal}
        </small>
    `;

    // Show meal distribution
    showMealDistribution(protein);

    // Trigger animations
    resultDiv.classList.add('show-result');
    setTimeout(() => {
        document.querySelector('.calculator').classList.remove('protein-party');
    }, 1000);
    
    // Track event
    if (typeof gtag === 'function') {
        gtag('event', 'calculate_protein', {
            'weight_kg': weightKg,
            'activity_level': activity,
            'goal': goal,
            'result': protein
        });
    }
    
    // Save to local storage
    saveCalculation('standard', {
        weight: weightKg,
        activity: activity,
        goal: goal,
        result: protein
    });
}

function calculateMuscleProtein() {
    // Get values
    const weight = validateWeightInput("muscle");
    if (!weight) return;
    const unit = document.querySelector('input[name="unit-muscle"]:checked').id;
    const experience = parseFloat(document.getElementById('experience').value);
    const intensity = parseFloat(document.getElementById('intensity').value);
    const resultDiv = document.querySelector('.result');

    // Convert units
    const weightKg = unit === 'lbs-muscle' ? weight * 0.453592 : weight;

    // Calculate protein (higher for muscle building)
    const protein = Math.round(weightKg * experience * intensity);
    
    // Calculate range
    const minProtein = Math.round(protein * 0.9);
    const maxProtein = Math.round(protein * 1.1);
    
    // Show range
    document.getElementById('minProtein').textContent = `${minProtein}g`;
    document.getElementById('maxProtein').textContent = `${maxProtein}g`;
    document.getElementById('proteinRange').classList.remove('d-none');

    // Show results
    document.getElementById('proteinResult').innerHTML = `
        <span class="muscle-emoji">💪</span>
        <strong class="display-4">${protein}g/day</strong>
        <span class="muscle-emoji">💪</span><br>
        <small class="text-muted mt-2 d-block">
            For optimal muscle growth, aim for ${(protein/weightKg).toFixed(1)}g per kg of body weight.<br>
            Calculation: ${weightKg.toFixed(1)}kg × ${experience} × ${intensity}
        </small>
    `;

    // Show meal distribution
    showMealDistribution(protein);

    // Trigger animations
    resultDiv.classList.add('show-result');
    
    // Track event
    if (typeof gtag === 'function') {
        gtag('event', 'calculate_muscle_protein', {
            'weight_kg': weightKg,
            'experience': experience,
            'intensity': intensity,
            'result': protein
        });
    }
    
    // Save to local storage
    saveCalculation('muscle', {
        weight: weightKg,
        experience: experience,
        intensity: intensity,
        result: protein
    });
}

function calculateWeightLossProtein() {
    // Get values
    const weight = validateWeightInput("loss");
    if (!weight) return;
    const unit = document.querySelector('input[name="unit-loss"]:checked').id;
    const bodyfat = parseFloat(document.getElementById('bodyfat').value);
    const deficit = parseFloat(document.getElementById('deficit').value);
    const resultDiv = document.querySelector('.result');

    // Convert units
    const weightKg = unit === 'lbs-loss' ? weight * 0.453592 : weight;

    // Calculate protein (higher for weight loss to preserve muscle)
    const protein = Math.round(weightKg * bodyfat * deficit);
    
    // Calculate range
    const minProtein = Math.round(protein * 0.9);
    const maxProtein = Math.round(protein * 1.1);
    
    // Show range
    document.getElementById('minProtein').textContent = `${minProtein}g`;
    document.getElementById('maxProtein').textContent = `${maxProtein}g`;
    document.getElementById('proteinRange').classList.remove('d-none');

    // Show results
    document.getElementById('proteinResult').innerHTML = `
        <span class="muscle-emoji">💪</span>
        <strong class="display-4">${protein}g/day</strong>
        <span class="muscle-emoji">💪</span><br>
        <small class="text-muted mt-2 d-block">
            For preserving muscle during weight loss, aim for ${(protein/weightKg).toFixed(1)}g per kg of body weight.<br>
            Calculation: ${weightKg.toFixed(1)}kg × ${bodyfat} × ${deficit}
        </small>
    `;

    // Show meal distribution
    showMealDistribution(protein);

    // Trigger animations
    resultDiv.classList.add('show-result');
    
    // Track event
    if (typeof gtag === 'function') {
        gtag('event', 'calculate_weight_loss_protein', {
            'weight_kg': weightKg,
            'bodyfat': bodyfat,
            'deficit': deficit,
            'result': protein
        });
    }
    
    // Save to local storage
    saveCalculation('weight_loss', {
        weight: weightKg,
        bodyfat: bodyfat,
        deficit: deficit,
        result: protein
    });
}

// Unit conversion functions
function setupUnitConversions() {
    // Standard calculator
    document.querySelectorAll('input[name="unit"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const currentWeight = document.getElementById('weight-standard').value;
            if (currentWeight) {
                const newValue = radio.id === 'lbs' 
                    ? currentWeight * 2.20462 
                    : currentWeight / 2.20462;
                document.getElementById('weight-standard').value = newValue.toFixed(1);
            }
        });
    });
    
    // Muscle gain calculator
    document.querySelectorAll('input[name="unit-muscle"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const currentWeight = document.getElementById('weight-muscle').value;
            if (currentWeight) {
                const newValue = radio.id === 'lbs-muscle' 
                    ? currentWeight * 2.20462 
                    : currentWeight / 2.20462;
                document.getElementById('weight-muscle').value = newValue.toFixed(1);
            }
        });
    });
    
    // Weight loss calculator
    document.querySelectorAll('input[name="unit-loss"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const currentWeight = document.getElementById('weight-loss').value;
            if (currentWeight) {
                const newValue = radio.id === 'lbs-loss' 
                    ? currentWeight * 2.20462 
                    : currentWeight / 2.20462;
                document.getElementById('weight-loss').value = newValue.toFixed(1);
            }
        });
    });
}

// Meal distribution visualization
function showMealDistribution(totalProtein) {
    const mealDistributionDiv = document.getElementById('mealDistribution');
    if (!mealDistributionDiv) return;
    
    mealDistributionDiv.classList.remove('d-none');
    
    // Calculate protein per meal (4 meals per day)
    const breakfast = Math.round(totalProtein * 0.25);
    const lunch = Math.round(totalProtein * 0.3);
    const dinner = Math.round(totalProtein * 0.3);
    const snack = Math.round(totalProtein * 0.15);
    
    // Update meal distribution chart
    document.getElementById('breakfastProtein').textContent = `${breakfast}g`;
    document.getElementById('lunchProtein').textContent = `${lunch}g`;
    document.getElementById('dinnerProtein').textContent = `${dinner}g`;
    document.getElementById('snackProtein').textContent = `${snack}g`;
    
    // Update progress bars
    document.getElementById('breakfastBar').style.width = `${(breakfast / totalProtein) * 100}%`;
    document.getElementById('lunchBar').style.width = `${(lunch / totalProtein) * 100}%`;
    document.getElementById('dinnerBar').style.width = `${(dinner / totalProtein) * 100}%`;
    document.getElementById('snackBar').style.width = `${(snack / totalProtein) * 100}%`;
}

// Save calculation to local storage
function saveCalculation(type, data) {
    const history = JSON.parse(localStorage.getItem('proteinCalculations') || '[]');
    
    // Add new calculation with timestamp
    history.push({
        type: type,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    // Keep only the last 10 calculations
    if (history.length > 10) {
        history.shift();
    }
    
    localStorage.setItem('proteinCalculations', JSON.stringify(history));
    
    // Update history display if it exists
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('calculationHistory');
    if (!historyContainer) return;
    
    const history = JSON.parse(localStorage.getItem('proteinCalculations') || '[]');
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="text-muted">No previous calculations</p>';
        return;
    }
    
    // Clear container
    historyContainer.innerHTML = '';
    
    // Add history items (most recent first)
    history.reverse().forEach((item, index) => {
        const date = new Date(item.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item p-2 border-bottom';
        
        let typeLabel = '';
        switch(item.type) {
            case 'standard': typeLabel = 'Standard'; break;
            case 'muscle': typeLabel = 'Muscle Gain'; break;
            case 'weight_loss': typeLabel = 'Weight Loss'; break;
        }
        
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span class="badge bg-primary">${typeLabel}</span>
                <small class="text-muted">${formattedDate}</small>
            </div>
            <div class="mt-1">
                <strong>${item.data.result}g</strong> of protein per day
            </div>
            <button class="btn btn-sm btn-outline-secondary mt-1" onclick="loadCalculation(${index})">
                Load
            </button>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

// Load calculation from history
function loadCalculation(index) {
    const history = JSON.parse(localStorage.getItem('proteinCalculations') || '[]');
    const item = history.reverse()[index];
    
    if (!item) return;
    
    // Switch to appropriate tab
    let tabToActivate;
    switch(item.type) {
        case 'standard':
            tabToActivate = document.getElementById('standard-tab');
            document.getElementById('weight-loss').value = item.data.weight;
            document.getElementById('activity').value = item.data.activity;
            document.getElementById('goal').value = item.data.goal;
            setTimeout(() => calculateProtein(), 100);
            break;
            
        case 'muscle':
            tabToActivate = document.getElementById('muscle-tab');
            document.getElementById('weight-muscle').value = item.data.weight;
            document.getElementById('experience').value = item.data.experience;
            document.getElementById('intensity').value = item.data.intensity;
            setTimeout(() => calculateMuscleProtein(), 100);
            break;
            
        case 'weight_loss':
            tabToActivate = document.getElementById('weight-loss-tab');
            document.getElementById('weight-loss').value = item.data.weight;
            document.getElementById('bodyfat').value = item.data.bodyfat;
            document.getElementById('deficit').value = item.data.deficit;
            setTimeout(() => calculateWeightLossProtein(), 100);
            break;
    }
    
    if (tabToActivate) {
        const tab = new bootstrap.Tab(tabToActivate);
        tab.show();
    }
}

// Share results function
function shareResults(platform) {
    const proteinResult = document.getElementById('proteinResult').innerText.split('\n')[0];
    const url = 'https://calculateprotein.com/';
    const text = `I need ${proteinResult} of protein daily according to this calculator!`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=My Daily Protein Needs&body=${encodeURIComponent(text + ' Check it out: ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
    
    // Track sharing event
    if (typeof gtag === 'function') {
        gtag('event', 'share_results', {
            'platform': platform
        });
    }
}

// Print results
function printResults() {
    const proteinResult = document.getElementById('proteinResult').innerText;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Protein Calculation Results</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .result { font-size: 24px; text-align: center; margin: 20px 0; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>My Protein Calculation Results</h1>
                    <p>From CalculateProtein.com</p>
                </div>
                
                <div class="result">
                    ${proteinResult}
                </div>
                
                <div id="mealPlan">
                    <h2>Suggested Meal Distribution</h2>
                    <p>Breakfast: ${document.getElementById('breakfastProtein').textContent} of protein</p>
                    <p>Lunch: ${document.getElementById('lunchProtein').textContent} of protein</p>
                    <p>Dinner: ${document.getElementById('dinnerProtein').textContent} of protein</p>
                    <p>Snack: ${document.getElementById('snackProtein').textContent} of protein</p>
                </div>
                
                <div class="footer">
                    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    <p>Visit <a href="https://calculateprotein.com">calculateprotein.com</a> for more nutrition tools</p>
                </div>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Email results
function emailResults() {
    const proteinResult = document.getElementById('proteinResult').innerText.split('\n')[0];
    const emailSubject = 'My Protein Calculator Results';
    const emailBody = `
My Daily Protein Needs: ${proteinResult}

Suggested Meal Distribution:
- Breakfast: ${document.getElementById('breakfastProtein').textContent} of protein
- Lunch: ${document.getElementById('lunchProtein').textContent} of protein
- Dinner: ${document.getElementById('dinnerProtein').textContent} of protein
- Snack: ${document.getElementById('snackProtein').textContent} of protein

Calculate your own protein needs at: https://calculateprotein.com
    `;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup unit conversions
    setupUnitConversions();
    
    // Load calculation history
    updateHistoryDisplay();
    
    // Setup tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});
