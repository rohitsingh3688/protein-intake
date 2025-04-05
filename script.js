/**
 * Protein Calculator - Main Script
 * 
 * This script handles all functionality for the protein calculator website
 * including standard, muscle gain, and weight loss calculators.
 * 
 * Includes fixes for:
 * 1. Results being copied across tabs
 * 2. Weight Loss tab error with valid weight input
 */

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing protein calculator");
    
    // Set up unit conversions
    setupUnitConversions();
    
    // Update calculation history display
    updateHistoryDisplay();
    
    // Set up tab switching to clear previous results
    setupTabSwitching();
    
    // Set up direct handler for Weight Loss tab button
    setupWeightLossButtonFix();
});

/**
 * Set up tab switching to clear previous results
 */
function setupTabSwitching() {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    // Add click event listener to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(`Tab clicked: ${button.id}`);
            // Clear previous results when switching tabs
            clearResults();
        });
    });
}

/**
 * Set up direct handler for Weight Loss tab button to fix the ID conflict issue
 * This is the fix for the Weight Loss tab button click issue
 */
function setupWeightLossButtonFix() {
    console.log("Setting up direct fix for weight loss button");
    
    // Get the weight loss calculate button
    const weightLossButton = document.querySelector('#weight-loss button');
    
    // If the button exists, add a new click handler
    if (weightLossButton) {
        console.log("Found weight loss button, adding direct click handler");
        
        // Add new click handler
        weightLossButton.addEventListener('click', function(event) {
            console.log("Weight loss button clicked with direct handler");
            
            // IMPORTANT FIX: Get the weight input by tag name instead of ID
            // This avoids the ID conflict issue where both the container and input have the same ID
            const weightInputs = document.querySelectorAll('#weight-loss input[type="number"]');
            const weightInput = weightInputs[0]; // Get the first number input in the weight-loss tab
            
            console.log("Weight input element:", weightInput);
            
            if (!weightInput) {
                console.error("Weight input element not found");
                alert("Error: Could not find weight input element");
                return;
            }
            
            // Get the weight value
            const weight = parseFloat(weightInput.value);
            console.log(`Weight value: ${weight}`);
            
            if (isNaN(weight) || weight <= 0) {
                console.log("Invalid weight value");
                alert("Please enter a valid weight 🏋️‍♂️");
                weightInput.focus();
                return;
            }
            
            // Get other values
            const unit = document.querySelector('input[name="unit-loss"]:checked').id;
            const bodyfat = parseFloat(document.getElementById('bodyfat').value);
            const deficit = parseFloat(document.getElementById('deficit').value);
            
            console.log(`Unit: ${unit}, Body Fat: ${bodyfat}, Deficit: ${deficit}`);
            
            // Convert units
            const weightKg = unit === 'lbs-loss' ? weight * 0.453592 : weight;
            console.log(`Weight in kg: ${weightKg}`);
            
            // Calculate protein
            const protein = Math.round(weightKg * bodyfat * deficit);
            console.log(`Calculated protein: ${protein}g`);
            
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
            
            // Show result container
            const resultDiv = document.querySelector('.result');
            if (resultDiv) {
                resultDiv.classList.add('show-result');
            }
            
            console.log("Results displayed for weight loss calculator");
            
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
        });
    } else {
        console.error("Weight loss button not found");
    }
}

/**
 * Clear previous results
 */
function clearResults() {
    console.log("Clearing previous results");
    
    // Hide the result container
    const resultDiv = document.querySelector('.result');
    if (resultDiv) {
        resultDiv.classList.remove('show-result');
    }
    
    // Clear the protein result content
    const proteinResult = document.getElementById('proteinResult');
    if (proteinResult) {
        proteinResult.innerHTML = '';
    }
    
    // Hide the protein range
    const proteinRange = document.getElementById('proteinRange');
    if (proteinRange) {
        proteinRange.classList.add('d-none');
    }
    
    // Hide meal distribution
    const mealDistribution = document.getElementById('mealDistribution');
    if (mealDistribution) {
        mealDistribution.classList.add('d-none');
    }
}

/**
 * Set up unit conversions
 */
function setupUnitConversions() {
    // Standard calculator unit conversion
    document.getElementById('kg').addEventListener('change', function() {
        const weightInput = document.getElementById('weight');
        if (weightInput.value) {
            weightInput.value = (parseFloat(weightInput.value) * 0.453592).toFixed(1);
        }
    });
    
    document.getElementById('lbs').addEventListener('change', function() {
        const weightInput = document.getElementById('weight');
        if (weightInput.value) {
            weightInput.value = (parseFloat(weightInput.value) / 0.453592).toFixed(1);
        }
    });
    
    // Muscle gain calculator unit conversion
    document.getElementById('kg-muscle').addEventListener('change', function() {
        const weightInput = document.getElementById('weight-muscle');
        if (weightInput.value) {
            weightInput.value = (parseFloat(weightInput.value) * 0.453592).toFixed(1);
        }
    });
    
    document.getElementById('lbs-muscle').addEventListener('change', function() {
        const weightInput = document.getElementById('weight-muscle');
        if (weightInput.value) {
            weightInput.value = (parseFloat(weightInput.value) / 0.453592).toFixed(1);
        }
    });
    
    // Weight loss calculator unit conversion
    document.getElementById('kg-loss').addEventListener('change', function() {
        const weightInputs = document.querySelectorAll('#weight-loss input[type="number"]');
        const weightInput = weightInputs[0];
        if (weightInput && weightInput.value) {
            weightInput.value = (parseFloat(weightInput.value) * 0.453592).toFixed(1);
        }
    });
    
    document.getElementById('lbs-loss').addEventListener('change', function() {
        const weightInputs = document.querySelectorAll('#weight-loss input[type="number"]');
        const weightInput = weightInputs[0];
        if (weightInput && weightInput.value) {
            weightInput.value = (parseFloat(weightInput.value) / 0.453592).toFixed(1);
        }
    });
}

/**
 * Standard calculator function
 */
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

/**
 * Muscle gain calculator function
 */
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

/**
 * Weight loss calculator function
 * Note: This function is kept for compatibility, but the direct handler is used instead
 */
function calculateWeightLossProtein() {
    console.log("Original calculateWeightLossProtein function called - this is bypassed by the direct handler");
    // This function is kept for compatibility, but the direct handler is used instead
    // See setupWeightLossButtonFix() for the actual implementation
}

/**
 * Validate weight input
 * @param {string} tabId - The ID of the current tab
 * @returns {number|boolean} - The weight value or false if invalid
 */
function validateWeightInput(tabId) {
    // Get the correct weight input element based on tab
    let weightInput;
    
    if (tabId === "standard") {
        weightInput = document.getElementById('weight');
    } else if (tabId === "muscle") {
        weightInput = document.getElementById('weight-muscle');
    } else if (tabId === "loss" || tabId === "weight-loss") {
        // For weight loss tab, use querySelectorAll to avoid ID conflict
        const weightInputs = document.querySelectorAll('#weight-loss input[type="number"]');
        weightInput = weightInputs[0];
    }
    
    // Check if element exists
    if (!weightInput) {
        console.error(`Weight input element not found for tab: ${tabId}`);
        alert(`Error: Could not find weight input for ${tabId} tab. Please check the HTML.`);
        return false;
    }
    
    // Validate the weight value
    const weight = parseFloat(weightInput.value);
    
    if (isNaN(weight) || weight <= 0) {
        alert("Please enter a valid weight 🏋️‍♂️");
        weightInput.focus();
        return false;
    }
    
    return weight;
}

/**
 * Show meal distribution
 * @param {number} totalProtein - The total protein amount
 */
function showMealDistribution(totalProtein) {
    const mealDistributionDiv = document.getElementById('mealDistribution');
    if (!mealDistributionDiv) {
        console.error("Meal distribution div not found");
        return;
    }
    
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

/**
 * Save calculation to local storage
 * @param {string} type - The type of calculation
 * @param {object} data - The calculation data
 */
function saveCalculation(type, data) {
    try {
        // Get existing history or initialize empty array
        let history = JSON.parse(localStorage.getItem('proteinCalculations')) || [];
        
        // Add new calculation with timestamp
        history.unshift({
            type: type,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Keep only the last 5 calculations
        if (history.length > 5) {
            history = history.slice(0, 5);
        }
        
        // Save back to local storage
        localStorage.setItem('proteinCalculations', JSON.stringify(history));
        
        // Update the display
        updateHistoryDisplay();
    } catch (e) {
        console.error("Error saving calculation to local storage:", e);
    }
}

/**
 * Update calculation history display
 */
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('calculationHistory');
    if (!historyContainer) return;
    
    try {
        // Get history from local storage
        const history = JSON.parse(localStorage.getItem('proteinCalculations')) || [];
        
        // If no history, show message
        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="text-muted">No previous calculations</p>';
            return;
        }
        
        // Build history HTML
        let historyHTML = '';
        
        history.forEach((item, index) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            let details = '';
            if (item.type === 'standard') {
                details = `${item.data.weight.toFixed(1)}kg, Activity: ${item.data.activity}, Goal: ${item.data.goal}`;
            } else if (item.type === 'muscle') {
                details = `${item.data.weight.toFixed(1)}kg, Experience: ${item.data.experience}, Intensity: ${item.data.intensity}`;
            } else if (item.type === 'weight_loss') {
                details = `${item.data.weight.toFixed(1)}kg, Body Fat: ${item.data.bodyfat}, Deficit: ${item.data.deficit}`;
            }
            
            historyHTML += `
                <div class="history-item" onclick="loadCalculation(${index})">
                    <div class="d-flex justify-content-between">
                        <strong>${item.data.result}g/day</strong>
                        <small>${formattedDate}</small>
                    </div>
                    <small class="text-muted">${details}</small>
                </div>
            `;
        });
        
        historyContainer.innerHTML = historyHTML;
    } catch (e) {
        console.error("Error updating history display:", e);
        historyContainer.innerHTML = '<p class="text-muted">Error loading calculation history</p>';
    }
}

/**
 * Load calculation from history
 * @param {number} index - The index of the calculation in history
 */
function loadCalculation(index) {
    try {
        // Get history from local storage
        const history = JSON.parse(localStorage.getItem('proteinCalculations')) || [];
        
        // Get the selected calculation
        const calculation = history[index];
        if (!calculation) return;
        
        // Display the result
        const resultDiv = document.querySelector('.result');
        
        // Show protein amount
        document.getElementById('proteinResult').innerHTML = `
            <span class="muscle-emoji">💪</span>
            <strong class="display-4">${calculation.data.result}g/day</strong>
            <span class="muscle-emoji">💪</span><br>
            <small class="text-muted mt-2 d-block">
                Loaded from history: ${new Date(calculation.timestamp).toLocaleString()}
            </small>
        `;
        
        // Show range
        const minProtein = Math.round(calculation.data.result * 0.9);
        const maxProtein = Math.round(calculation.data.result * 1.1);
        document.getElementById('minProtein').textContent = `${minProtein}g`;
        document.getElementById('maxProtein').textContent = `${maxProtein}g`;
        document.getElementById('proteinRange').classList.remove('d-none');
        
        // Show meal distribution
        showMealDistribution(calculation.data.result);
        
        // Show result container
        resultDiv.classList.add('show-result');
        
    } catch (e) {
        console.error("Error loading calculation:", e);
        alert("Error loading calculation from history");
    }
}

/**
 * Share results via various methods
 * @param {string} platform - The platform to share on
 */
function shareResults(platform) {
    // Get the protein result
    const proteinResult = document.getElementById('proteinResult').innerText;
    if (!proteinResult) return;
    
    // Create share text
    const shareText = `My daily protein needs: ${proteinResult} - Calculated with CalculateProtein.com`;
    const shareUrl = 'https://calculateprotein.com/';
    
    // Share based on platform
    switch (platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
            break;
        case 'pinterest':
            window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
            break;
        case 'email':
            window.location.href = `mailto:?subject=My Protein Calculator Results&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
            break;
    }
    
    // Track share event
    if (typeof gtag === 'function') {
        gtag('event', 'share_result', {
            'method': platform
        });
    }
}

/**
 * Print results
 */
function printResults() {
    window.print();
    
    // Track print event
    if (typeof gtag === 'function') {
        gtag('event', 'print_result');
    }
}

/**
 * Email results
 */
function emailResults() {
    // Get the protein result
    const proteinResult = document.getElementById('proteinResult').innerText;
    if (!proteinResult) return;
    
    // Create email text
    const emailSubject = 'My Protein Calculator Results';
    const emailBody = `My daily protein needs: ${proteinResult}\n\nCalculated with CalculateProtein.com\n\nhttps://calculateprotein.com/`;
    
    // Open email client
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Track email event
    if (typeof gtag === 'function') {
        gtag('event', 'email_result');
    }
}
