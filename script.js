function calculateProtein() {
    const weight = parseFloat(document.getElementById('weight').value);
    const unit = document.querySelector('input[name="unit"]:checked').id;
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = parseFloat(document.getElementById('goal').value);
    const resultDiv = document.querySelector('.result');

    if (!weight || isNaN(weight)) {
        alert("Please enter a valid weight.");
        return;
    }

    // Convert lbs to kg if needed
    const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;

    // Calculate protein needs
    const protein = Math.round(weightKg * activity * goal);

    // Display results
    document.getElementById('proteinResult').innerHTML = `
        <strong>${protein} grams per day</strong><br>
        <small>Calculation: 
        ${weightKg.toFixed(1)}kg (${unit === 'lbs' ? `${weight}lbs` : 'input'}) 
        × ${activity} (activity) 
        × ${goal} (goal) 
        = ${protein}g
        </small>
    `;
    resultDiv.style.display = 'block';
}

// Optional: Add unit conversion toggle functionality
document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const currentWeight = document.getElementById('weight').value;
        if (currentWeight) {
            // Convert existing value when switching units
            const newValue = radio.id === 'lbs' 
                ? currentWeight * 2.20462 
                : currentWeight / 2.20462;
            document.getElementById('weight').value = newValue.toFixed(1);
        }
    });
});