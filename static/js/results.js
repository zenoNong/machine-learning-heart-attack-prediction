const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public')); // Serve static files from 'public' directory

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 

class ResultsPage {
    constructor() {
        this.displayResults();
    }

    displayResults() {
        // Add any interactive features for the results page
        const predictionElements = document.querySelectorAll('.prediction-value');
        predictionElements.forEach(elem => {
            const value = parseInt(elem.textContent);
            elem.classList.add(value === 1 ? 'danger' : 'normal');
        });
    }
}

// Initialize if on results page
if (document.querySelector('.prediction-result')) {
    new ResultsPage();
} 